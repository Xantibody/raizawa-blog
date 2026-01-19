import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
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

const generateFilename = (): string => {
  const now = new Date();
  const dateStr = getLocalDateStr(now);
  const files = readdirSync(POSTS_DIR);
  const todayFiles = new Set(
    files.filter((file) => file.startsWith(dateStr) && file.endsWith(".md")),
  );

  let suffix = 1;
  while (todayFiles.has(`${dateStr}_${suffix}.md`)) {
    suffix++;
  }

  return `${dateStr}_${suffix}.md`;
};

const formatDate = (): string => {
  const now = new Date();
  const date = getLocalDateStr(now);
  const hours = String(now.getHours()).padStart(PAD_WIDTH, "0");
  const minutes = String(now.getMinutes()).padStart(PAD_WIDTH, "0");
  return `${date} ${hours}:${minutes}`;
};

const processTemplate = (content: string, title: string): string => {
  const dateStr = formatDate();

  return content
    .replace(/^date:.*$/m, `date: ${dateStr}`)
    .replace(/^title:.*$/m, `title: ${title}`)
    .replace(/^draft:.*$/m, "draft: false");
};

const readTemplate = (templateFile: string): string => {
  const templatePath = join(TEMPLATES_DIR, templateFile);
  return readFileSync(templatePath, "utf8");
};

const getTemplateName = (templateFile: string): string => templateFile.replace(".md", "");

const createPost = (templateFile: string, title: string): string => {
  const templateContent = readTemplate(templateFile);
  const newContent = processTemplate(templateContent, title);
  const filename = generateFilename();
  const outputPath = join(POSTS_DIR, filename);

  if (existsSync(outputPath)) {
    throw new Error(`File already exists: ${outputPath}`);
  }

  writeFileSync(outputPath, newContent);
  return outputPath;
};

const printResult = (outputPath: string, title: string): void => {
  console.log(`\nCreated: ${outputPath}`);
  console.log(`  Title: ${title}`);
  console.log(`  Date: ${formatDate()}`);
};

export { createPost, getTemplateName, getTemplates, printResult };
