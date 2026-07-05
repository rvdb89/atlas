import type { MissionCard } from "./MissionCard";
import { createBriefSection, renderBulletList } from "./BriefSection";
import { getBriefTemplate } from "./BriefTemplate";

export function buildTechnicalRequirementsSection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);
  const missionRequirements = [
    `Implement ${card.title} under src/atlas/ with index.ts exports`,
    `Integrate with Atlas bootstrap without breaking existing modules`,
    ...card.focus.map((item) => `Deliver ${item} with rule-based local logic`),
  ];

  return createBriefSection(
    "technical-requirements",
    "Technische eisen",
    renderBulletList([...template.technicalRequirements, ...missionRequirements]),
  );
}

export function buildSecuritySection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);

  return createBriefSection(
    "security",
    "Security",
    renderBulletList([
      ...template.securityRequirements,
      ...card.constraints.filter((item) => /secret|api|env|security/i.test(item)),
    ]),
  );
}

export function buildNorthStarSection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);
  const missionNorthStar = [`Mission ${card.mission} advances ${card.title} toward Atlas autonomy`];

  return createBriefSection(
    "north-star",
    "North Star",
    renderBulletList([...template.northStarGoals, ...missionNorthStar]),
  );
}
