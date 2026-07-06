import type { MissionCard, MissionTemplateId } from "./MissionCard";

export type BriefTemplate = {
  id: MissionTemplateId;
  label: string;
  phase: string;
  scopeIntro: string;
  architecturePrinciples: string[];
  technicalRequirements: string[];
  securityRequirements: string[];
  northStarGoals: string[];
  outOfScopeDefaults: string[];
  validationChecks: string[];
  reportingItems: string[];
  claudeOutputRequirements: string[];
};

const BASE_ARCHITECTURE = [
  "Atlas core blijft domein-onafhankelijk",
  "Registry pattern voor uitbreidbaarheid",
  "Geen vertical-specifieke logica in generieke modules",
  "TypeScript-first en strict compileerbaar",
];

const BASE_SECURITY = [
  "Geen .env of API keys in source control",
  "Geen secrets in logs",
  "Provider credentials alleen via environment/config layer",
];

const BASE_NORTH_STAR = [
  "Atlas als AI Operating System",
  "Generieke architectuur boven vertical coupling",
  "Meer autonomie, minder handmatige tussenkomst",
  "Uitbreidbare planning, memory, context en agents",
];

const BASE_VALIDATION = [
  "npx tsc --noEmit",
  "npm run atlas:health",
  "npm run atlas:audit",
  "npm run atlas:mission <MISSION_ID>",
  "Bestaande workflows blijven intact",
];

const BASE_REPORTING = [
  "Lijst van nieuwe en gewijzigde bestanden",
  "Architectuur uitleg",
  "Definition of Done status",
  "Open items voor volgende sprint",
];

const BASE_CLAUDE_OUTPUT = [
  "ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)",
  "ChatGPT schrijft nooit Architecture Briefs",
  "Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation",
  "Atlas genereert het Engineering Package via npm run atlas:mission",
  "Claude ontvangt alleen claude-engineering-package.md",
  "Rapportage na sprint via Atlas Auditor",
];

function createTemplate(
  id: MissionTemplateId,
  label: string,
  phase: string,
  scopeIntro: string,
  extras: Partial<BriefTemplate> = {},
): BriefTemplate {
  return {
    id,
    label,
    phase,
    scopeIntro,
    architecturePrinciples: extras.architecturePrinciples ?? BASE_ARCHITECTURE,
    technicalRequirements: extras.technicalRequirements ?? [
      "Clean TypeScript zonder placeholders",
      "Exports via index.ts barrels",
      "Bootstrap chain blijft intact",
    ],
    securityRequirements: extras.securityRequirements ?? BASE_SECURITY,
    northStarGoals: extras.northStarGoals ?? BASE_NORTH_STAR,
    outOfScopeDefaults: extras.outOfScopeDefaults ?? [
      "Geen breaking changes",
      "Geen ongevraagde refactors",
      "Geen externe database zonder expliciete opdracht",
    ],
    validationChecks: extras.validationChecks ?? BASE_VALIDATION,
    reportingItems: extras.reportingItems ?? BASE_REPORTING,
    claudeOutputRequirements: extras.claudeOutputRequirements ?? BASE_CLAUDE_OUTPUT,
  };
}

export const BRIEF_TEMPLATES: Record<MissionTemplateId, BriefTemplate> = {
  engineering: createTemplate(
    "engineering",
    "Engineering Mission",
    "PHASE 2 — ATLAS ENGINEERING",
    "Platform engineering, tooling, CLI en developer experience.",
    {
      architecturePrinciples: [
        ...BASE_ARCHITECTURE,
        "CLI tools volgen Atlas script conventies",
        "Generated artifacts landen in engineering/ directories",
      ],
      technicalRequirements: [
        "npm scripts voor alle CLI entrypoints",
        "Rule-based generation zonder AI dependency",
        "Studio integratie via summary JSON",
      ],
    },
  ),
  brain: createTemplate(
    "brain",
    "Brain Mission",
    "PHASE 2 — ATLAS BRAIN",
    "Atlas Brain capabilities: planning, memory, context, decision en agents.",
    {
      architecturePrinciples: [
        ...BASE_ARCHITECTURE,
        "Brain modules blijven provider-onafhankelijk",
        "Geen Claude- of Doughbert-logica in brain core",
      ],
      northStarGoals: [
        ...BASE_NORTH_STAR,
        "Autonome besluitvorming via Decision Engine",
        "Context-aware execution",
      ],
    },
  ),
  studio: createTemplate(
    "studio",
    "Studio Mission",
    "PHASE 2 — ATLAS STUDIO",
    "Atlas Studio OS, Mission Control, Command Center en Studio UX.",
    {
      architecturePrinciples: [
        ...BASE_ARCHITECTURE,
        "Studio gebruikt registries voor widgets, commands en panels",
        "UI panels blijven thin — geen businesslogica duplicatie",
      ],
    },
  ),
  infrastructure: createTemplate(
    "infrastructure",
    "Infrastructure Mission",
    "PHASE 2 — ATLAS INFRASTRUCTURE",
    "Bootstrap, diagnostics, health, launcher en platform reliability.",
    {
      technicalRequirements: [
        "Startup checks blijven non-blocking in development",
        "Health report uitbreidbaar via diagnostics registry",
        "Geen hardcoded environment assumptions",
      ],
    },
  ),
  ai: createTemplate(
    "ai",
    "AI Mission",
    "PHASE 2 — ATLAS AI",
    "AI orchestration, providers, tasks en agent integration.",
    {
      architecturePrinciples: [
        ...BASE_ARCHITECTURE,
        "AI providers achter abstraction layer",
        "Geen directe vendor calls buiten provider adapters",
      ],
    },
  ),
  voice: createTemplate(
    "voice",
    "Voice Mission",
    "PHASE 2 — ATLAS VOICE",
    "Voice interfaces, speech pipelines en voice-aware workflows.",
    {
      northStarGoals: [
        ...BASE_NORTH_STAR,
        "Natural voice interaction met Atlas agents",
      ],
    },
  ),
  publishing: createTemplate(
    "publishing",
    "Publishing Mission",
    "PHASE 2 — ATLAS PUBLISHING",
    "Publishing pipeline, drafts, review en module content delivery.",
    {
      architecturePrinciples: [
        ...BASE_ARCHITECTURE,
        "Publishing blijft module-aware via plugin registry",
      ],
    },
  ),
};

export function getBriefTemplate(templateId: MissionTemplateId): BriefTemplate {
  return BRIEF_TEMPLATES[templateId];
}

export function getTemplateLabel(card: MissionCard): string {
  return getBriefTemplate(card.templateId).label;
}
