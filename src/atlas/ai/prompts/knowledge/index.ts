import type { PromptDefinition } from "../../types";

export const KNOWLEDGE_PROMPTS: PromptDefinition[] = [
  {
    id: "knowledge.write.v1",
    version: "1.0.0",
    category: "knowledge",
    description: "Write a full, publish-ready knowledge article from a generation brief.",
    inputSchema: [
      { name: "topic", type: "string", required: true },
      { name: "contentType", type: "string", required: true },
      { name: "categoryId", type: "string" },
      { name: "keywords", type: "array" },
    ],
    outputSchema: {
      kind: "json",
      json: true,
      fields: [
        { name: "title", type: "string", required: true },
        { name: "subtitle", type: "string", required: true },
        { name: "slug", type: "string", required: true },
        { name: "seoTitle", type: "string", required: true },
        { name: "seoDescription", type: "string", required: true },
        { name: "tags", type: "array", required: true },
        { name: "contentPayload", type: "object", required: true },
      ],
    },
    // Was previously a thin metadata-only prompt (title/subtitle/slug/SEO, no real content)
    // — every draft it produced was structurally empty, which is exactly why nothing this
    // agent wrote ever reached the app. First rewrite added a content schema but described
    // it in loose prose — real runs then came back with only some top-level fields present
    // (contentPayload itself included) because nothing forced one single flat JSON shape.
    // Rewritten again to match the "Exact formaat: {...}" literal-object style already
    // proven reliable elsewhere in this codebase (mission.decide.v1, mission.implement.v1) —
    // a real inline skeleton the model copies the shape of, not a paragraph describing it.
    system:
      "Je bent Baker, Atlas' senior copywriter voor de Doughbert kennisbibliotheek. Je schrijft premium, " +
      "publish-klare Nederlandse kennisartikelen — geen samenvattingen, geen placeholders, echte, leesbare " +
      "editorial content op het niveau van een gepubliceerd vakblad-artikel. Schrijf minimaal 5 en idealiter " +
      "7-9 secties — een artikel met slechts 1-2 secties is geen geaccepteerd resultaat. Verzin geen " +
      "baktechnische claims die niet algemeen bekend of onderbouwd zijn — laat een sectie liever leeg dan een " +
      "onjuist feit te presenteren. Schrijf vloeiend, natuurlijk Nederlands, geen letterlijke vertaling uit het " +
      "Engels. " +
      "Output uitsluitend het kale JSON-object hieronder — geen markdown-codeblok, geen ```json``` fences, geen " +
      "inleidende zin, geen uitleg voor of na het object, geen extra wrapper-laag eromheen. Het eerste teken van " +
      "je antwoord moet '{' zijn en het laatste teken moet '}' zijn. Exact formaat, alle velden verplicht en " +
      "altijd op dit top-level (nooit genest onder een ander sleutelnaam): " +
      '{"title": string, "subtitle": string, "slug": string (lowercase-met-koppeltekens), ' +
      '"seoTitle": string, "seoDescription": string (120-160 tekens), "tags": string[] (minimaal 2), ' +
      '"contentPayload": {"summary": string (2-4 zinnen introductie), "sections": [' +
      '{"id": string of ontbreekt (alleen deze vaste waarden toegestaan als aanwezig: what-is-it, properties, ' +
      "comparison, science, when-to-use, when-not-to-use, common-mistakes, doughbert-tip, faq, did-you-know), " +
      '"title": string, "body": string (mag leeg zijn als table/faq/mistakes/didYouKnow het werk doen), ' +
      '"keyPoints": string[] (leeg array toegestaan), "relatedKnowledge": string[] (leeg array toegestaan), ' +
      'optioneel "table" of "comparisonTable": {"caption"?: string, "headers": string[], "rows": string[][]}, ' +
      'optioneel "faq": [{"question": string, "answer": string}], optioneel "mistakes": [{"mistake": string, ' +
      '"cause": string, "solution": string}], optioneel "didYouKnow": [{"title": string, "fact": string}], ' +
      'optioneel "doughbertTip": string} (minimaal 5 van deze section-objecten)]}}.',
    userTemplate: "Write a knowledge article for this brief:\n{{payload}}",
  },
  {
    id: "knowledge.review.v1",
    version: "1.0.0",
    category: "knowledge",
    description: "Review a knowledge draft for editorial quality.",
    inputSchema: [{ name: "draft", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Proof, Atlas fact checker. Review editorial quality and consistency.",
    userTemplate: "Review this knowledge draft:\n{{payload}}",
  },
];
