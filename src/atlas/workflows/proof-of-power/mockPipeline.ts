import { slugify } from "@/atlas/entity/utils/slug";
import type { ProofOfPowerInput, ProofOfPowerMockContent } from "./types";

const T80_TEMPLATE: ProofOfPowerMockContent = {
  title: "T80 Franse bloem",
  summary:
    "T80 is een Franse halfvolkoren bloem met meer smaak, hogere wateropname en meer karakter dan T65.",
  body: [
    "T80 (Type 80) is een Franse halfvolkoren tarwebloem met ongeveer 80% extract.",
    "De bloem geeft meer smaak, hogere wateropname en meer karakter dan T65.",
    "Ideaal voor landbrood, pain de campagne en langere rijs.",
    "Combineer met autolyse en stretch & fold voor optimale glutenontwikkeling.",
  ].join("\n\n"),
  relations: ["T65", "T130", "Hydratatie", "Pain de Campagne", "Autolyse", "Stretch & Fold"],
  visualPlan: [
    {
      id: "vis-hero",
      role: "hero",
      label: "Hero image van T80 bloem",
      prompt: "Premium hero shot of French T80 flour in a linen sack, warm natural light",
    },
    {
      id: "vis-texture",
      role: "detail",
      label: "Close-up meelstructuur",
      prompt: "Macro close-up of T80 flour texture showing bran specks and fine grain",
    },
    {
      id: "vis-compare",
      role: "comparison",
      label: "Vergelijking T65 / T80 / T130",
      prompt: "Side-by-side comparison of T65, T80 and T130 flour types in bowls",
    },
    {
      id: "vis-hydration",
      role: "infographic",
      label: "Hydratatie infographic",
      prompt: "Clean infographic showing hydration differences between flour types",
    },
  ],
  qualityScore: 96,
  factCheckPassed: true,
  publishingStatus: "ready_for_review",
  factCheckNotes: "All factual claims verified against module knowledge base (mock).",
};

function buildGenericContent(input: ProofOfPowerInput): ProofOfPowerMockContent {
  const title = input.topic.trim();
  const slug = slugify(title);

  return {
    title,
    summary: `${title} — een ${input.contentType.toLowerCase()} gegenereerd door Atlas voor ${input.moduleLabel}.`,
    body: [
      `Dit is een mock ${input.contentType} over "${title}".`,
      `Atlas heeft onderzoek, copywriting en linking gesimuleerd voor module ${input.moduleLabel}.`,
      `De output is klaar voor redactionele review in ${input.language}.`,
    ].join("\n\n"),
    relations: ["Related topic A", "Related topic B", "Core technique", "Foundation concept"],
    visualPlan: [
      {
        id: `${slug}-hero`,
        role: "hero",
        label: `Hero image — ${title}`,
        prompt: `Hero visual for "${title}" in ${input.moduleLabel} style`,
      },
      {
        id: `${slug}-detail`,
        role: "detail",
        label: `Detail visual — ${title}`,
        prompt: `Close-up detail supporting "${title}"`,
      },
      {
        id: `${slug}-diagram`,
        role: "diagram",
        label: `Concept diagram — ${title}`,
        prompt: `Educational diagram explaining "${title}"`,
      },
    ],
    qualityScore: 88 + Math.floor(Math.random() * 10),
    factCheckPassed: true,
    publishingStatus: "ready_for_review",
    factCheckNotes: "Mock fact check passed — no blocking issues detected.",
  };
}

export function buildMockPipelineContent(input: ProofOfPowerInput): ProofOfPowerMockContent {
  const normalizedTopic = input.topic.trim().toLowerCase();

  if (normalizedTopic.includes("t80") || normalizedTopic.includes("franse bloem")) {
    return { ...T80_TEMPLATE, title: input.topic.trim() || T80_TEMPLATE.title };
  }

  return buildGenericContent(input);
}
