import type { PromptDefinition } from "../../types";

export const TIPS_PROMPTS: PromptDefinition[] = [
  {
    id: "tips.write.v1",
    version: "1.0.0",
    category: "tips",
    description: "Write a small batch of short, practical one-liner tips for a fixed tip category.",
    inputSchema: [
      { name: "categoryId", type: "string", required: true },
      { name: "categoryLabel", type: "string", required: true },
      { name: "count", type: "number", required: true },
      { name: "existingTips", type: "array", required: true },
    ],
    outputSchema: {
      kind: "json",
      json: true,
      fields: [{ name: "tips", type: "array", required: true }],
    },
    // Mirrors the "Exact formaat: {...}" literal-object style already proven reliable for
    // knowledge.write.v1/mission.implement.v1 — a real inline skeleton the model copies the
    // shape of. Deliberately a much smaller ask than knowledge.write.v1: one short sentence
    // per tip, no sections, no sources, no visuals.
    system:
      "Je bent Baker, Atlas' senior copywriter voor de Doughbert app. Je schrijft korte, praktische " +
      "baktips — precies zoals de bestaande tips in de app: één zin, direct bruikbaar, geen inleiding, " +
      "geen 'Tip:'-prefix, geen opsomming binnen de zin. Elke tip staat op zichzelf en herhaalt geen " +
      "advies dat al in de meegegeven bestaande tips staat — verzin geen tip die inhoudelijk hetzelfde " +
      "zegt als een bestaande, ook niet in andere woorden. Verzin geen baktechnische claims die niet " +
      "algemeen bekend of onderbouwd zijn. Schrijf vloeiend, natuurlijk Nederlands. " +
      "Output uitsluitend het kale JSON-object hieronder — geen markdown-codeblok, geen inleidende zin, " +
      "geen uitleg. Het eerste teken van je antwoord moet '{' zijn en het laatste teken moet '}' zijn. " +
      'Exact formaat: {"tips": [{"text": string (één zin, 40-160 tekens, geen aanhalingstekens)}]} — ' +
      "precies het gevraagde aantal tips in de array, niet meer en niet minder.",
    userTemplate: "Schrijf nieuwe tips voor deze brief:\n{{payload}}",
  },
];
