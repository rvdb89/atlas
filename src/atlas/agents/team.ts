import type { CoreAgentId, EditorInChief, TeamMember } from "@/atlas/publishing/plugin/types";
import type { AiTaskType } from "@/atlas/publishing/orchestration/types";

/** Project Atlas AI Team — platform agents shared by all modules. */
export const EDITOR_IN_CHIEF: EditorInChief = {
  emoji: "🎯",
  name: "Editor-in-Chief",
  role: "Jij",
  tagline: "Review · Feedback · Goedkeuren · Publiceren",
  description:
    "Jij schrijft niets meer. Jij ontwerpt het platform, bepaalt de standaarden en keurt de output goed of af.",
};

export const ATLAS_AI_TEAM: TeamMember[] = [
  {
    id: "copywriter",
    emoji: "✍️",
    name: "Baker",
    role: "Senior Copywriter",
    tagline: "Woorden met warmte en precisie",
    responsibilities: [
      "Knowledge Bites",
      "Artikelen",
      "Tips & Tricks",
      "Wetenschappelijke content",
      "Technieken",
      "Introducties",
      "FAQ",
    ],
    serviceIds: ["copywriter-v1", "copywriter"],
  },
  {
    id: "visual-designer",
    emoji: "🎨",
    name: "Canvas",
    role: "Visual Designer",
    tagline: "Beelden die kennis zichtbaar maken",
    responsibilities: [
      "Hero afbeeldingen",
      "Stap-voor-stap visuals",
      "Galleries",
      "Detail shots",
      "Diagrammen",
      "Infographics",
      "Vergelijkingsvisuals",
    ],
    serviceIds: ["visual-designer-v1", "visual-designer"],
  },
  {
    id: "fact-checker",
    emoji: "🔬",
    name: "Proof",
    role: "Fact Checker",
    tagline: "Redactionele en wetenschappelijke controle",
    responsibilities: [
      "Wetenschappelijke controle",
      "Consistentie",
      "Terminologie",
      "Spelling",
      "Eenheden",
      "SEO metadata",
      "Interne kwaliteit",
    ],
    serviceIds: ["fact-checker-v1", "fact-checker"],
  },
  {
    id: "link-engine",
    emoji: "🔗",
    name: "Atlas",
    role: "Knowledge Architect",
    tagline: "De kennisbank verbinden",
    responsibilities: [
      "Interne links",
      "Gerelateerde artikelen",
      "Tags",
      "Categorieën",
      "Zoekoptimalisatie",
      "Kennisstructuur",
    ],
    serviceIds: ["link-engine-v1", "link-engine"],
  },
  {
    id: "translator",
    emoji: "🌍",
    name: "Lingo",
    role: "Localization Specialist",
    tagline: "Atlas wereldwijd",
    responsibilities: [
      "Vertalingen",
      "Meertalige content",
      "Culturele aanpassingen",
      "Internationale terminologie",
    ],
    serviceIds: ["translator-v1", "translator"],
  },
  {
    id: "domain-validator",
    emoji: "🧪",
    name: "Test Kitchen",
    role: "Domain Validator",
    tagline: "Technische validatie per vertical",
    responsibilities: [
      "Domain standards",
      "Technische controle",
      "Consistentie",
      "Praktische validatie",
      "Score & feedback",
    ],
    serviceIds: ["domain-validator-v1", "test-kitchen-v1", "test-kitchen"],
  },
];

export const ATLAS_PIPELINE_ORDER: CoreAgentId[] = [
  "copywriter",
  "visual-designer",
  "fact-checker",
  "link-engine",
  "translator",
  "domain-validator",
];

export const ATLAS_STUDIO_MISSION =
  "Een complete AI-uitgeverij — 95% automatisch, jij doet de eindredactie.";

const memberByServiceId = new Map<string, TeamMember>();
for (const member of ATLAS_AI_TEAM) {
  for (const serviceId of member.serviceIds) {
    memberByServiceId.set(serviceId, member);
  }
  memberByServiceId.set(member.id, member);
}

export function getTeamMember(id: CoreAgentId): TeamMember {
  return ATLAS_AI_TEAM.find((member) => member.id === id)!;
}

export function getTeamMemberByServiceId(serviceId: string): TeamMember | undefined {
  return memberByServiceId.get(serviceId);
}

export function formatAgentLabel(serviceId: string): string {
  const member = getTeamMemberByServiceId(serviceId);
  if (!member) {
    return serviceId;
  }
  return `${member.emoji} ${member.name}`;
}

export function getPipelineFlowLabel(includeEditor = true): string {
  const agents = ATLAS_PIPELINE_ORDER.map((id) => {
    const member = getTeamMember(id);
    return `${member.emoji} ${member.name}`;
  });

  if (includeEditor) {
    agents.push(`${EDITOR_IN_CHIEF.emoji} ${EDITOR_IN_CHIEF.name}`);
  }

  return agents.join(" → ");
}

export function mapTaskTypeToServiceId(taskType: AiTaskType): string {
  switch (taskType) {
    case "copywriting":
      return "copywriter-v1";
    case "visual_design":
      return "visual-designer-v1";
    case "fact_checking":
    case "scientific_validation":
    case "seo":
      return "fact-checker-v1";
    case "internal_linking":
      return "link-engine-v1";
    case "translation":
      return "translator-v1";
    case "domain_validation":
      return "domain-validator-v1";
    default:
      return "copywriter-v1";
  }
}

/** @deprecated Use ATLAS_AI_TEAM */
export const AI_TEAM = ATLAS_AI_TEAM;
/** @deprecated Use ATLAS_PIPELINE_ORDER */
export const AI_PIPELINE_ORDER = ATLAS_PIPELINE_ORDER;
/** @deprecated Use ATLAS_STUDIO_MISSION */
export const STUDIO_MISSION = ATLAS_STUDIO_MISSION;
