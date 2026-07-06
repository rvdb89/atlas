import type { InferredMissionContext } from "./MissionKnowledge";
import { renderBulletList, renderChecklist } from "./MissionKnowledge";

const BASE_AUDIT_CHECKS = [
  "TypeScript compiles clean (npx tsc --noEmit)",
  "Atlas health passes (npm run atlas:health)",
  "Atlas audit passes (npm run atlas:audit)",
  "Strict audit passes (npm run atlas:audit -- --strict)",
  "No blockers in audit report",
  "Release decision is APPROVED or APPROVED_WITH_NOTES",
  "No .env staged or committed",
  "No hardcoded API keys in source",
  "No Claude references outside provider layer",
  "No Doughbert logic in Atlas brain/core",
  "npm run atlas:brief still works (backward compatibility)",
];

export function generateAuditChecklistDocument(
  context: InferredMissionContext,
  atlasVersion: string,
  atlasBuild: string,
): string {
  const { card } = context;
  const platformChecks = [
    ...BASE_AUDIT_CHECKS,
    `npm run atlas:mission ${card.mission} regenerates package`,
  ];

  return [
    `# Audit Checklist — ${card.mission}`,
    "",
    "> Inferred by Atlas from Mission ID and platform audit rules.",
    "",
    `- Mission · **${card.mission}**`,
    `- Title · **${card.title}**`,
    `- Atlas · ${atlasVersion} (${atlasBuild})`,
    `- Generated · ${new Date().toISOString()}`,
    "",
    "## Platform audit gates",
    "",
    ...platformChecks.map((item) => `- [ ] ${item}`),
    "",
    "## Mission-specific checks",
    "",
    renderChecklist(context.definitionOfDone),
    "",
    "## Architecture rules",
    "",
    renderChecklist(context.architectureRules),
    "",
    "## Security standards",
    "",
    "- [ ] Geen .env of API keys in source control",
    "- [ ] Geen secrets in logs",
    "- [ ] Provider credentials alleen via environment/config layer",
    "",
  ].join("\n");
}
