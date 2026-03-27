import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { type Plugin } from "vite";

const VIRTUAL_MODULE_ID = "virtual:git-timestamps";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;
const FRONTMATTER_CLOSE = "\n---\n";

interface CommitEntry {
  date: string;
  hash: string;
}

const getRepoRoot = (): string => {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
  } catch {
    throw new Error(
      "Failed to find git repository root. Ensure git is installed and the project is a git repository.",
    );
  }
};

const stripFrontmatter = (content: string): string => {
  const endIndex = content.indexOf(FRONTMATTER_CLOSE, 1);
  if (endIndex === -1) {
    return content;
  }
  return content.slice(endIndex + FRONTMATTER_CLOSE.length);
};

const parseCommitLog = (output: string): CommitEntry[] =>
  output.split("\n").map((line) => {
    const spaceIdx = line.indexOf(" ");
    return { date: line.slice(spaceIdx + 1), hash: line.slice(0, spaceIdx) };
  });

const getCommitLog = (filePath: string, repoRoot: string): CommitEntry[] => {
  try {
    const output = execFileSync("git", ["log", "--follow", "--format=%H %aI", "--", filePath], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();

    if (output === "") {
      return [];
    }
    return parseCommitLog(output);
  } catch {
    return [];
  }
};

const getBodyAtCommit = (ctx: FileContext, hash: string): string | undefined => {
  try {
    const content = execFileSync("git", ["show", `${hash}:${ctx.relativePath}`], {
      cwd: ctx.repoRoot,
      encoding: "utf8",
    });
    return stripFrontmatter(content);
  } catch {
    return undefined;
  }
};

interface FileContext {
  relativePath: string;
  repoRoot: string;
}

const hasBodyChanged = (ctx: FileContext, current: CommitEntry, older: CommitEntry): boolean => {
  const currentBody = getBodyAtCommit(ctx, current.hash);
  const olderBody = getBodyAtCommit(ctx, older.hash);
  if (currentBody === undefined || olderBody === undefined) {
    return true;
  }
  return currentBody !== olderBody;
};

const findLastBodyChange = (commits: CommitEntry[], ctx: FileContext): string | undefined => {
  if (commits.length === 0) {
    return undefined;
  }

  for (let idx = 0; idx < commits.length - 1; idx++) {
    const current = commits[idx];
    const older = commits[idx + 1];
    if (current === undefined || older === undefined) {
      break;
    }
    if (hasBodyChanged(ctx, current, older)) {
      return current.date;
    }
  }

  return commits.at(-1)?.date;
};

interface CollectContext {
  isDev: boolean;
  postsDir: string;
  repoRoot: string;
}

const resolveUpdatedAt = (file: string, ctx: CollectContext): string => {
  const filePath = join(ctx.postsDir, file);
  const relativePath = relative(ctx.repoRoot, filePath);
  const commits = getCommitLog(filePath, ctx.repoRoot);
  const fileCtx: FileContext = { relativePath, repoRoot: ctx.repoRoot };
  const updatedAt = findLastBodyChange(commits, fileCtx);

  if (updatedAt !== undefined) {
    return updatedAt;
  }
  if (ctx.isDev) {
    return new Date().toISOString();
  }
  throw new Error(`No git history found for ${file}. Ensure the file is committed.`);
};

const collectTimestamps = (postsDir: string, ctx: CollectContext): Record<string, string> => {
  const files = readdirSync(postsDir, { recursive: true })
    .map(String)
    .filter((file) => file.endsWith(".md"));

  const entries = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    return [slug, resolveUpdatedAt(file, ctx)] as const;
  });

  return Object.fromEntries(entries);
};

const gitTimestampsPlugin = (postsDir: string): Plugin => {
  const resolvedPostsDir = resolve(postsDir);
  let timestamps: Record<string, string> = {};
  let ctx: CollectContext = { isDev: false, postsDir: resolvedPostsDir, repoRoot: "" };

  return {
    configResolved(config) {
      ctx = {
        isDev: config.command === "serve",
        postsDir: resolvedPostsDir,
        repoRoot: getRepoRoot(),
      };
      timestamps = collectTimestamps(resolvedPostsDir, ctx);
    },

    handleHotUpdate({ file }) {
      if (file.startsWith(resolvedPostsDir) && file.endsWith(".md")) {
        const relativePath = file.slice(resolvedPostsDir.length + 1);
        const slug = relativePath.replace(/\.md$/, "");
        timestamps[slug] = resolveUpdatedAt(relativePath, ctx);
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
