import type { PromptDefinition } from "../../types";

export const TRANSLATION_PROMPTS: PromptDefinition[] = [
  {
    id: "translation.prepare.v1",
    version: "1.0.0",
    category: "translation",
    description: "Prepare translation bundles for target locales.",
    inputSchema: [
      { name: "draft", type: "object", required: true },
      { name: "targetLocales", type: "array", required: true },
    ],
    outputSchema: { kind: "json", json: true },
    system: "You are Lingo. Prepare localization bundles.",
    userTemplate: "Prepare translations:\n{{payload}}",
  },
];
