import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import { ROOT_DIR } from "./atlas/shared";

const SOURCE_PATH = "NORTH_STAR.md";
const OUTPUT_PATH = "src/atlas/constitution/generated/northStar.generated.ts";

function extractSection(markdown: string, chapterNumber: number): string {
  const pattern = new RegExp(
    `^## ${chapterNumber}\\..*$([\\s\\S]*?)(?=^## \\d+\\.|^---|\\Z)`,
    "m",
  );
  const match = markdown.match(pattern);
  if (!match) {
    throw new Error(`NORTH_STAR.md: hoofdstuk ${chapterNumber} niet gevonden. Structuur gewijzigd?`);
  }
  return match[1].trim();
}

function extractParagraphs(section: string): string {
  return section
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

function extractBullets(section: string): string[] {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function extractVersion(markdown: string): string {
  const match = markdown.match(/\*\*Status:\*\*\s*v(\d+(?:\.\d+)*)/);
  if (!match) {
    throw new Error("NORTH_STAR.md: geen versie gevonden in de Status-regel.");
  }
  return match[1];
}

function escapeTemplateLiteral(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function renderStringArray(items: string[]): string {
  return `[\n${items.map((item) => `  \`${escapeTemplateLiteral(item)}\`,`).join("\n")}\n]`;
}

function main(): void {
  const sourcePath = join(ROOT_DIR, SOURCE_PATH);
  if (!existsSync(sourcePath)) {
    throw new Error(`NORTH_STAR.md niet gevonden op ${sourcePath}.`);
  }
  const markdown = readFileSync(sourcePath, "utf8");

  const version = extractVersion(markdown);
  const mission = extractParagraphs(extractSection(markdown, 1));
  const vision = extractParagraphs(extractSection(markdown, 2));
  const compass = extractParagraphs(extractSection(markdown, 3));
  const corePrinciples = extractBullets(extractSection(markdown, 4));
  const testQuestions = extractBullets(extractSection(markdown, 5));

  const outputPath = join(ROOT_DIR, OUTPUT_PATH);
  mkdirSync(join(outputPath, ".."), { recursive: true });

  const contents = `// GENERATED FILE — do not edit by hand.
// Bron: NORTH_STAR.md — run \`npm run atlas:northstar\` om te regenereren na een amendement.
// Gegenereerd op: ${new Date().toISOString()}

export const NORTH_STAR_SOURCE_PATH = "${SOURCE_PATH}";
export const NORTH_STAR_VERSION = "${version}";

export const NORTH_STAR_MISSION = \`${escapeTemplateLiteral(mission)}\`;

export const NORTH_STAR_VISION = \`${escapeTemplateLiteral(vision)}\`;

export const NORTH_STAR_COMPASS = \`${escapeTemplateLiteral(compass)}\`;

export const NORTH_STAR_CORE_PRINCIPLES: string[] = ${renderStringArray(corePrinciples)};

export const NORTH_STAR_TEST_QUESTIONS: string[] = ${renderStringArray(testQuestions)};
`;

  writeFileSync(outputPath, contents, "utf8");

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("North Star Sync"));
  console.log("");
  console.log(`Bron    · ${chalk.cyan(SOURCE_PATH)} (v${version})`);
  console.log(`Output  · ${OUTPUT_PATH}`);
  console.log(`Mission · ${mission.slice(0, 60)}...`);
  console.log(`Compass · ${compass}`);
  console.log("");
  console.log(chalk.green("North Star constants gegenereerd"));
  console.log("");
}

main();
