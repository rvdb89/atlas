import { buildDefinitionOfDoneSection } from "../brief-generator/ValidationBuilder";
import type { MissionCard } from "../brief-generator/MissionCard";

export function generateDefinitionOfDoneDocument(card: MissionCard, atlasVersion: string, atlasBuild: string): string {
  const section = buildDefinitionOfDoneSection(card);

  return [
    `# Definition of Done — ${card.mission}`,
    "",
    `- Mission · **${card.mission}**`,
    `- Title · **${card.title}**`,
    `- Atlas · ${atlasVersion} (${atlasBuild})`,
    `- Generated · ${new Date().toISOString()}`,
    "",
    section.body.trim(),
    "",
    "## Release gate",
    "",
    "- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES",
    "- [ ] npm run atlas:mission " + card.mission + " regenerates package without errors",
    "",
  ].join("\n");
}
