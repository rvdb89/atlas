import type { AtlasConstitution } from "./constitution.types";
import {
  ATLAS_CONSTITUTION_PATH,
  getAtlasConstitution,
  renderConstitutionHierarchy,
} from "./AtlasConstitution";

export { ATLAS_CONSTITUTION_PATH };

export function renderConstitutionMarkdown(constitution: AtlasConstitution = getAtlasConstitution()): string {
  const capabilityList = constitution.capabilities
    .map((item) => `- **${item.name}** (${item.id}) — ${item.description}`)
    .join("\n");

  const systemList = constitution.systems
    .map((item) => `- **${item.name}** (${item.id}) — ${item.purpose}\n  - Evolution: ${item.evolution}`)
    .join("\n");

  const roadmapList = [...constitution.roadmap]
    .sort((left, right) => left.priority - right.priority)
    .map((item) => `- **${item.missionId}** · ${item.title} (P${item.priority}) — ${item.rationale}`)
    .join("\n");

  const bullet = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

  return [
    `# ${constitution.title}`,
    "",
    `> **${constitution.id}** · Constitution v${constitution.version} · Highest source of truth for Atlas`,
    "",
    "## Hierarchy",
    "",
    "```",
    renderConstitutionHierarchy(),
    "```",
    "",
    "## Why Atlas Exists",
    "",
    constitution.whyAtlasExists,
    "",
    "## North Star",
    "",
    constitution.northStar,
    "",
    "## Principles",
    "",
    bullet(constitution.principles),
    "",
    "## Long-term Vision",
    "",
    bullet(constitution.longTermVision),
    "",
    "## Capabilities",
    "",
    capabilityList,
    "",
    "## Systems",
    "",
    systemList,
    "",
    "## How Systems Evolve",
    "",
    bullet(constitution.systemEvolutionRules),
    "",
    "## How Missions Are Derived",
    "",
    bullet(constitution.missionDerivationRules),
    "",
    "## How Atlas Decides Priorities",
    "",
    bullet(constitution.priorityRules),
    "",
    "## How Atlas Evaluates North Star Progress",
    "",
    bullet(constitution.northStarEvaluationRules),
    "",
    "## Decision Framework",
    "",
    `> **${constitution.decisionFramework.id}** · ${constitution.decisionFramework.title} v${constitution.decisionFramework.version}`,
    "",
    "### Decision hierarchy",
    "",
    "```",
    constitution.decisionFramework.hierarchy.join("\n↓\n"),
    "```",
    "",
    bullet(constitution.decisionFramework.rules),
    "",
    "## Evolution Engine",
    "",
    `> **${constitution.evolutionEngine.id}** · ${constitution.evolutionEngine.title} v${constitution.evolutionEngine.version}`,
    "",
    "The Constitution defines who Atlas is. The Evolution Engine teaches Atlas how to evolve itself.",
    "",
    "### Evolution hierarchy",
    "",
    "```",
    constitution.evolutionEngine.hierarchy.join("\n↓\n"),
    "```",
    "",
    "### Evolution rules",
    "",
    bullet(constitution.evolutionEngine.rules),
    "",
    "## Roadmap",
    "",
    roadmapList,
    "",
    "---",
    "",
    `_Generated from Atlas Constitution module · ${constitution.generatedAt}_`,
    "",
  ].join("\n");
}
