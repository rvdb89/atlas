import type { MissionCard } from "./MissionCard";
import { createBriefSection, renderBulletList } from "./BriefSection";
import { getBriefTemplate } from "./BriefTemplate";

export function buildMetadataSection(card: MissionCard, atlasVersion: string, atlasBuild: string) {
  const template = getBriefTemplate(card.templateId);

  return createBriefSection(
    "metadata",
    "Mission Metadata",
    [
      `- Mission ID · **${card.mission}**`,
      `- Title · **${card.title}**`,
      `- Template · ${template.label}`,
      `- Phase · ${template.phase}`,
      `- Atlas Version · ${atlasVersion} (${atlasBuild})`,
      `- Generated · ${new Date().toISOString()}`,
    ].join("\n"),
  );
}

export function buildGoalSection(card: MissionCard) {
  return createBriefSection("goal", "Doel", card.goal);
}

export function buildScopeSection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);
  const focusItems = card.focus.length > 0 ? card.focus : [card.title];

  return createBriefSection(
    "scope",
    "Scope",
    [template.scopeIntro, "", "### Focus", renderBulletList(focusItems)].join("\n"),
  );
}

export function buildOutOfScopeSection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);
  const items = [...new Set([...card.constraints, ...template.outOfScopeDefaults])];

  return createBriefSection("out-of-scope", "Niet doen", renderBulletList(items));
}

export function buildArchitectureSection(card: MissionCard) {
  const template = getBriefTemplate(card.templateId);
  const focusArchitecture = card.focus.map((item) => `Implement ${item} using registry-based Atlas patterns.`);

  return createBriefSection(
    "architecture",
    "Architectuur",
    [
      "### Principes",
      renderBulletList(template.architecturePrinciples),
      "",
      "### Mission Architecture",
      renderBulletList(focusArchitecture),
    ].join("\n"),
  );
}
