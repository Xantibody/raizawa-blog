import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PAD_WIDTH = 2;

const POSTS_DIR = join(import.meta.dir, "../app/posts");
const TEMPLATES_DIR = join(import.meta.dir, "templates");

const getTemplates = (): string[] => {
  const files = readdirSync(TEMPLATES_DIR);
  return files.filter((file) => file.endsWith(".md"));
};

const getLocalDateStr = (now: Date): string => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(PAD_WIDTH, "0");
  const day = String(now.getDate()).padStart(PAD_WIDTH, "0");
  return `${year}-${month}-${day}`;
};

interface GeneratedPath {
  dir: string;
  filename: string;
}

const generateFilePath = (slug: string): GeneratedPath => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(PAD_WIDTH, "0");
  return { dir: join(year, month), filename: `${slug}.md` };
};

const formatCreatedAt = (now: Date): string => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(PAD_WIDTH, "0");
  const day = String(now.getDate()).padStart(PAD_WIDTH, "0");
  const hours = String(now.getHours()).padStart(PAD_WIDTH, "0");
  const minutes = String(now.getMinutes()).padStart(PAD_WIDTH, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const processTemplate = (content: string, title: string): string =>
  content
    .replace(/^title:.*$/m, `title: ${title}`)
    .replace(/^createdAt:.*$/m, `createdAt: ${formatCreatedAt(new Date())}`);

const readTemplate = (templateFile: string): string => {
  const templatePath = join(TEMPLATES_DIR, templateFile);
  return readFileSync(templatePath, "utf8");
};

const getTemplateName = (templateFile: string): string => templateFile.replace(".md", "");

const createPost = (templateFile: string, title: string, slug: string): string => {
  const templateContent = readTemplate(templateFile);
  const newContent = processTemplate(templateContent, title);
  const { dir, filename } = generateFilePath(slug);
  const outputDir = join(POSTS_DIR, dir);
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, filename);

  if (existsSync(outputPath)) {
    throw new Error(`File already exists: ${outputPath}`);
  }

  writeFileSync(outputPath, newContent);
  return outputPath;
};

const printResult = (outputPath: string, title: string): void => {
  console.log(`\nCreated: ${outputPath}`);
  console.log(`  Title: ${title}`);
};

export { createPost, getTemplateName, getTemplates, printResult };
