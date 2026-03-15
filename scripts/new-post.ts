import { execSync } from "node:child_process";
import { type Interface, createInterface } from "node:readline";
import { createPost, getTemplateName, getTemplates, printResult } from "./post-utils";

const RADIX = 10;

const prompt = (rl: Interface, question: string): Promise<string> =>
  new Promise((resolve) => {
    rl.question(question, resolve);
  });

const displayTemplates = (templates: string[]): void => {
  console.log("\nAvailable templates:");
  templates.forEach((template, idx) => {
    const name = getTemplateName(template);
    console.log(`  ${idx + 1}. ${name}`);
  });
};

const selectTemplate = async (rl: Interface, templates: string[]): Promise<string> => {
  const selection = await prompt(rl, "\nSelect template (number): ");
  const index = parseInt(selection, RADIX) - 1;

  if (Number.isNaN(index) || index < 0 || index >= templates.length) {
    throw new Error("Invalid selection");
  }

  return templates[index];
};

const getTitle = async (rl: Interface, templateFile: string): Promise<string> => {
  const templateName = getTemplateName(templateFile);
  const defaultTitle = `${templateName}の記事`;
  const input = await prompt(rl, `Title [${defaultTitle}]: `);
  if (input.length > 0) {
    return input;
  }
  return defaultTitle;
};

const openInEditor = (filePath: string): void => {
  const editor = process.env["EDITOR"] ?? "vi";
  console.log(`\nOpening with ${editor}...`);
  execSync(`${editor} "${filePath}"`, { stdio: "inherit" });
};

const runInteractive = async (rl: Interface, templates: string[]): Promise<void> => {
  displayTemplates(templates);
  const templateFile = await selectTemplate(rl, templates);
  const title = await getTitle(rl, templateFile);
  rl.close();

  const outputPath = createPost(templateFile, title);
  printResult(outputPath, title);
  openInEditor(outputPath);
};

const runNonInteractive = (templates: string[], templateName: string, title: string): void => {
  const templateFile = `${templateName}.md`;
  if (!templates.includes(templateFile)) {
    const validNames = templates.map(getTemplateName).join(", ");
    console.error(`Error: Unknown template "${templateName}"`);
    console.error(`Valid templates: ${validNames}`);
    process.exit(1);
  }

  const outputPath = createPost(templateFile, title);
  printResult(outputPath, title);
};

const main = async (): Promise<void> => {
  const templates = getTemplates();

  if (templates.length === 0) {
    throw new Error("No templates found. Create a *.md file in scripts/templates/");
  }

  const args = process.argv.slice(2);

  if (args.length === 0) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    try {
      await runInteractive(rl, templates);
    } catch (error) {
      rl.close();
      throw error;
    }
    return;
  }

  if (args.length === 1) {
    console.error("Usage: bun run new-post -- <template> <title>");
    console.error("Example: bun run new-post -- rust \"Rustの勉強[unsafe その3]\"");
    process.exit(1);
  }

  const templateName = args[0];
  const title = args.slice(1).join(" ");
  runNonInteractive(templates, templateName, title);
};

await main();
