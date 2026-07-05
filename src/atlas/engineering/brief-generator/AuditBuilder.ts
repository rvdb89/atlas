import type { MissionCard } from "./MissionCard";
import { createBriefSection, renderBulletList } from "./BriefSection";
import { getBriefTemplate } from "./BriefTemplate";

export function buildReportingSection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);
  const items = [
    ...template.reportingItems,
    `Generated brief path: engineering/briefs/${card.mission}.md`,
    "Atlas Auditor cross-check via npm run atlas:audit",
    "Mission Generator status zichtbaar in Command Center",
  ];

  return createBriefSection("reporting", "Rapportage", renderBulletList(items));
}

export function buildClaudeOutputRequirementsSection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);

  return createBriefSection(
    "claude-output",
    "Claude Output Requirements",
    renderBulletList([
      ...template.claudeOutputRequirements,
      `Mission card format voor ${card.mission} gebruiken`,
      `Success criteria: ${card.success}`,
    ]),
  );
}
