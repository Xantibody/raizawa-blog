import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { type Plugin } from "vite";

interface GitTimestamp {
  createdAt: string;
  updatedAt: string;
}

const VIRTUAL_MODULE_ID = "virtual:git-timestamps";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

const getGitTimestamps = (filePath: string): GitTimestamp | undefined => {
  try {
    const output = execSync(`git log --follow --format=%aI -- "${filePath}"`, {
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

const collectTimestamps = (postsDir: string): Record<string, GitTimestamp> => {
  const timestamps: Record<string, GitTimestamp> = {};
  const files = readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  const now = new Date().toISOString();

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = join(postsDir, file);
    const gitTimestamp = getGitTimestamps(filePath);

    timestamps[slug] = gitTimestamp ?? { createdAt: now, updatedAt: now };
  }

  return timestamps;
};

const gitTimestampsPlugin = (postsDir: string): Plugin => {
  const resolvedPostsDir = resolve(postsDir);
  let timestamps: Record<string, GitTimestamp> = {};

  return {
    configResolved() {
      timestamps = collectTimestamps(resolvedPostsDir);
    },

    handleHotUpdate({ file }) {
      if (file.startsWith(resolvedPostsDir) && file.endsWith(".md")) {
        timestamps = collectTimestamps(resolvedPostsDir);
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
