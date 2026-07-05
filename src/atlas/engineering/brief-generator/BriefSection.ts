export type BriefSectionId =
  | "title"
  | "metadata"
  | "goal"
  | "scope"
  | "out-of-scope"
  | "architecture"
  | "technical-requirements"
  | "security"
  | "north-star"
  | "definition-of-done"
  | "validation"
  | "reporting"
  | "claude-output";

export type BriefSection = {
  id: BriefSectionId;
  title: string;
  body: string;
};

export function createBriefSection(id: BriefSectionId, title: string, body: string): BriefSection {
  return { id, title, body };
}

export function renderBriefSection(section: BriefSection): string {
  return `## ${section.title}\n\n${section.body.trim()}\n`;
}

export function renderBriefSections(sections: BriefSection[]): string {
  return sections.map(renderBriefSection).join("\n");
}

export function renderBulletList(items: string[]): string {
  if (items.length === 0) return "_None specified._";
  return items.map((item) => `- ${item}`).join("\n");
}
