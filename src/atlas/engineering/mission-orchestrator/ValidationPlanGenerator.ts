import type { InferredMissionContext } from "./MissionKnowledge";
import { renderBulletList } from "./MissionKnowledge";

export function generateValidationPlanDocument(
  context: InferredMissionContext,
  atlasVersion: string,
  atlasBuild: string,
): string {
  const { card } = context;

  return [
    `# Validation Plan — ${card.mission}`,
    "",
    "> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.",
    "",
    `- Mission · **${card.mission}**`,
    `- Title · **${card.title}**`,
    `- Atlas · ${atlasVersion} (${atlasBuild})`,
    `- Generated · ${new Date().toISOString()}`,
    "",
    "## Required commands",
    "",
    "```bash",
    `npm run atlas:mission ${card.mission}`,
    "npm run atlas:audit",
    "npm run atlas:audit -- --strict",
    "npx tsc --noEmit",
    "npm run atlas:health",
    "```",
    "",
    "## Validation checks",
    "",
    renderBulletList(context.validationChecks),
    "",
    "## Expected outcome",
    "",
    `- ${card.success}`,
    "- Existing Atlas workflows remain intact",
    "- TypeScript compiles without errors",
    "- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)",
    "",
  ].join("\n");
}
