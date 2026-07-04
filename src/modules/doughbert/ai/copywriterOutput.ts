import type { CopywriterOutput } from "@/atlas/publishing/agents/coreAgents";
import type { GenerationBrief } from "@/atlas/publishing/types";
import type { KnowledgeArticleInput } from "@/modules/doughbert/types/knowledgeArticleInput";
import type { KnowledgeBiteCategoryId } from "@/modules/doughbert/types/knowledgeBite";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function defaultCategoryForType(contentType: GenerationBrief["contentType"]): KnowledgeBiteCategoryId {
  switch (contentType) {
    case "recipe":
      return "brood";
    case "technique":
      return "technieken";
    case "ingredient":
      return "meel-bloem";
    case "science":
      return "bakwetenschap";
    case "guide":
      return "starter";
    case "tip":
      return "technieken";
    default:
      return "brood";
  }
}

function buildKnowledgeArticle(
  brief: GenerationBrief,
  title: string,
  subtitle: string,
  slug: string,
): KnowledgeArticleInput {
  const categoryId = (brief.categoryId as KnowledgeBiteCategoryId | undefined) ??
    defaultCategoryForType(brief.contentType);

  return {
    slug,
    categoryId,
    title,
    libraryOrder: 999,
    kind: "catalog",
    status: "draft",
    metadata: {
      subtitle,
      difficulty: "beginner",
      readingTimeMinutes: 8,
      tags: brief.keywords ?? [title, categoryId],
      relatedKnowledge: [],
      relatedRecipes: [],
      relatedTips: [],
    },
    content: {
      summary: `${title} — ${subtitle}. Dit artikel is geschreven door Baker en wacht op review door de redactie.`,
      sections: [],
    },
    relationTags: [title, ...(brief.keywords ?? []), categoryId],
  };
}

/** Domain output builder — invoked only via Atlas AI task handlers, never by models directly. */
export function buildCopywriterOutput(brief: GenerationBrief): CopywriterOutput {
  const title = brief.topic.trim();
  const slug = slugify(brief.slugHint ?? title);
  const subtitle = `Alles over ${title.toLowerCase()} — praktisch, wetenschappelijk en in Doughbert-stijl.`;

  return {
    title,
    subtitle,
    slug,
    contentPayload: buildKnowledgeArticle(brief, title, subtitle, slug),
    seoTitle: `${title} | Doughbert Knowledge`,
    seoDescription: subtitle,
    tags: brief.keywords ?? [title],
  };
}
