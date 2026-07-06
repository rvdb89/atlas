import type { MissionCard } from "./MissionCard";
import { createBriefSection, renderBulletList } from "./BriefSection";
import { getBriefTemplate } from "./BriefTemplate";

export function buildDefinitionOfDoneSection(card: MissionCard) {
  const items = [
    `${card.title} module bestaat onder src/atlas/`,
    "Mission Card parser werkt",
    "Brief templates zijn geregistreerd",
    "Markdown generator produceert volledige brief",
    "npm run atlas:brief werkt",
    "Generated brief wordt opgeslagen in engineering/briefs/",
    "Command Center toont laatste gegenereerde brief",
    "TypeScript compileert clean",
    card.success,
    ...card.constraints.map((item) => `Constraint gerespecteerd: ${item}`),
  ];

  const checklist = items.map((item) => `- [ ] ${item}`).join("\n");

  return createBriefSection("definition-of-done", "Definition of Done", checklist);
}

export function buildValidationSection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);
  const checks = [
    ...template.validationChecks,
    `npm run atlas:brief genereert ${card.mission}.md`,
    `npm run atlas:mission ${card.mission} genereert engineering package`,
    `Mission ${card.mission} DoD volledig afvinkbaar`,
  ];

  return createBriefSection("validation", "Validatie", renderBulletList(checks));
}
