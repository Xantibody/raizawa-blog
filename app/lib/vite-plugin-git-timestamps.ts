import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { type Plugin } from "vite";

interface GitTimestamp {
  createdAt: string;
  updatedAt: string;
}

const VIRTUAL_MODULE_ID = "virtual:git-timestamps";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

const getGitTimestamps = (filePath: string, repoRoot: string): GitTimestamp | undefined => {
  try {
    const output = execFileSync("git", ["log", "--follow", "--format=%aI", "--", filePath], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();

    if (output === "") {
      return undefined;
    }

    const dates = output.split("\n");
    const createdAt = dates.at(-1) ?? "";
    const updatedAt = dates[0] ?? "";

    return { createdAt, updatedAt };
  } catch {
    return undefined;
  }
};

const getRepoRoot = (): string =>
  execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();

interface CollectContext {
  fallback: GitTimestamp;
  isDev: boolean;
  postsDir: string;
  repoRoot: string;
}

const resolveTimestamp = (file: string, ctx: CollectContext): GitTimestamp => {
  const filePath = join(ctx.postsDir, file);
  const gitTimestamp = getGitTimestamps(filePath, ctx.repoRoot);

  if (gitTimestamp !== undefined) {
    return gitTimestamp;
  }
  if (ctx.isDev) {
    return ctx.fallback;
  }
  throw new Error(`No git history found for ${file}. Ensure the file is committed.`);
};

const collectTimestamps = (postsDir: string, isDev: boolean): Record<string, GitTimestamp> => {
  const files = readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  const now = new Date().toISOString();
  const ctx: CollectContext = {
    fallback: { createdAt: now, updatedAt: now },
    isDev,
    postsDir,
    repoRoot: getRepoRoot(),
  };

  const entries = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    return [slug, resolveTimestamp(file, ctx)] as const;
  });

  return Object.fromEntries(entries);
};

const gitTimestampsPlugin = (postsDir: string): Plugin => {
  const resolvedPostsDir = resolve(postsDir);
  let timestamps: Record<string, GitTimestamp> = {};
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
