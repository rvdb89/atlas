import type { VisualAssetBrief } from "@/atlas/publishing/types";
import type { ContentType, GenerationBrief } from "@/atlas/publishing/types";

type VisualDesignerInput = {
  brief: GenerationBrief;
  title: string;
  slug: string;
  contentType: ContentType;
};

function assetId(slug: string, role: string, index: number): string {
  return `${slug}-${role}-${index}`;
}

function heroPrompt(title: string, contentType: VisualDesignerInput["contentType"]): string {
  return `Premium editorial hero photo for Doughbert baking app: ${title}, ${contentType}, warm natural light, artisan bread aesthetic, shallow depth of field, no text overlay.`;
}

function buildKnowledgeAssets(input: VisualDesignerInput): VisualAssetBrief[] {
  return [
    {
      id: assetId(input.slug, "hero", 0),
      role: "hero",
      label: "Hero",
      prompt: heroPrompt(input.title, input.contentType),
      alt: `${input.title} — hero afbeelding`,
      aspectRatio: "16:9",
      status: "pending",
    },
    {
      id: assetId(input.slug, "gallery", 0),
      role: "gallery",
      label: "Gallery",
      prompt: `Editorial gallery image for ${input.title}, detail texture, warm tones.`,
      alt: `${input.title} — detail`,
      aspectRatio: "4:3",
      status: "pending",
    },
    {
      id: assetId(input.slug, "diagram", 0),
      role: "diagram",
      label: "Diagram",
      prompt: `Clean infographic diagram explaining ${input.title} for home bakers, minimal labels, Doughbert palette.`,
      alt: `${input.title} — diagram`,
      aspectRatio: "16:9",
      status: "pending",
    },
  ];
}

function buildFlourAssets(input: VisualDesignerInput): VisualAssetBrief[] {
  const roles: Array<{ role: VisualAssetBrief["role"]; label: string; prompt: string }> = [
    { role: "hero", label: "Graankorrel", prompt: `Close-up wheat grain for ${input.title}` },
    { role: "detail", label: "Structuur", prompt: `Flour structure macro for ${input.title}` },
    { role: "gallery", label: "Meel", prompt: `Fine flour pile, ${input.title}, warm light` },
    { role: "infographic", label: "Toepassing", prompt: `Usage infographic for ${input.title} in bread and pizza` },
  ];

  return roles.map((item, index) => ({
    id: assetId(input.slug, item.role, index),
    role: item.role,
    label: item.label,
    prompt: `${item.prompt}, premium food photography, Doughbert style.`,
    alt: `${input.title} — ${item.label}`,
    aspectRatio: "4:3" as const,
    status: "pending" as const,
  }));
}

function buildTechniqueAssets(input: VisualDesignerInput): VisualAssetBrief[] {
  return [1, 2, 3, 4].map((step) => ({
    id: assetId(input.slug, "step", step),
    role: "step" as const,
    label: `Stap ${step}`,
    prompt: `Step ${step} illustration for baking technique "${input.title}", hands-on, clear composition, Doughbert warm palette.`,
    alt: `${input.title} — stap ${step}`,
    aspectRatio: "4:3" as const,
    status: "pending" as const,
  }));
}

function buildRecipeAssets(input: VisualDesignerInput): VisualAssetBrief[] {
  const roles = [
    "hero",
    "gallery",
    "ingredient",
    "step",
    "detail",
    "comparison",
  ] as const;

  const labels = [
    "Hero",
    "Eindresultaat",
    "Ingrediënten",
    "Bereiding",
    "Doorsnede",
    "Korst & kruim",
  ];

  return roles.map((role, index) => ({
    id: assetId(input.slug, role, index),
    role,
    label: labels[index] ?? role,
    prompt: `${labels[index]} photo for recipe "${input.title}", artisan, premium, Doughbert.`,
    alt: `${input.title} — ${labels[index]}`,
    aspectRatio: role === "hero" ? ("16:9" as const) : ("4:3" as const),
    status: "pending" as const,
  }));
}

/** Doughbert visual designer — baking-specific image prompts. */
export class DoughbertVisualDesignerAgent {
  id = "visual-designer-v1";

  async generateAssets(input: VisualDesignerInput) {
    const started = Date.now();
    let assets: VisualAssetBrief[];

    switch (input.contentType) {
      case "ingredient":
        assets = buildFlourAssets(input);
        break;
      case "technique":
        assets = buildTechniqueAssets(input);
        break;
      case "recipe":
        assets = buildRecipeAssets(input);
        break;
      default:
        assets = buildKnowledgeAssets(input);
    }

    return {
      agent: this.id,
      durationMs: Date.now() - started,
      output: assets,
      warnings: ["Stub image provider — prompts opgeslagen, geen echte afbeeldingen gegenereerd."],
    };
  }
}

export const doughbertVisualDesignerAgent = new DoughbertVisualDesignerAgent();
