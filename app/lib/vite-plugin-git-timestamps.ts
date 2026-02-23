import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { type Plugin } from "vite";

const VIRTUAL_MODULE_ID = "virtual:git-timestamps";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

const getUpdatedAt = (filePath: string, repoRoot: string): string | undefined => {
  try {
    const output = execFileSync("git", ["log", "-1", "--format=%aI", "--", filePath], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();

    if (output === "") {
      return undefined;
    }
    return output;
  } catch {
    return undefined;
  }
};

const getRepoRoot = (): string =>
  execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();

interface CollectContext {
  isDev: boolean;
  postsDir: string;
  repoRoot: string;
}

const resolveUpdatedAt = (file: string, ctx: CollectContext): string => {
  const filePath = join(ctx.postsDir, file);
  const updatedAt = getUpdatedAt(filePath, ctx.repoRoot);

  if (updatedAt !== undefined) {
    return updatedAt;
  }
  if (ctx.isDev) {
    return new Date().toISOString();
  }
  throw new Error(`No git history found for ${file}. Ensure the file is committed.`);
};

const collectTimestamps = (postsDir: string, isDev: boolean): Record<string, string> => {
  const files = readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  const ctx: CollectContext = { isDev, postsDir, repoRoot: getRepoRoot() };

  const entries = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    return [slug, resolveUpdatedAt(file, ctx)] as const;
  });

  return Object.fromEntries(entries);
};

const gitTimestampsPlugin = (postsDir: string): Plugin => {
  const resolvedPostsDir = resolve(postsDir);
  let timestamps: Record<string, string> = {};
  let isDev = false;

  return {
    configResolved(config) {
      isDev = config.command === "serve";
      timestamps = collectTimestamps(resolvedPostsDir, isDev);
    },

    handleHotUpdate({ file }) {
      if (file.startsWith(resolvedPostsDir) && file.endsWith(".md")) {
        timestamps = collectTimestamps(resolvedPostsDir, isDev);
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export default ${JSON.stringify(timestamps)};`;
      }
    },

    name: "vite-plugin-git-timestamps",

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },
  };
};

export default gitTimestampsPlugin;
