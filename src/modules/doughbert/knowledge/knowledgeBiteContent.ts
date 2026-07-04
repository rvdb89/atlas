import { getStandardSectionTitle } from "./knowledgeBiteLayout";
import type {
  KnowledgeBiteArticle,
  KnowledgeBiteBody,
  KnowledgeBiteCategoryId,
  KnowledgeBiteMetadata,
  KnowledgeBiteSection,
  KnowledgeBiteSectionId,
  KnowledgeBiteStatus,
} from "@/types/knowledgeBite";

type CreateArticleInput = {
  title: string;
  categoryId: KnowledgeBiteCategoryId;
  subcategory?: string;
  status?: KnowledgeBiteStatus;
  metadataOverrides?: Partial<KnowledgeBiteMetadata>;
  contentOverrides?: Partial<KnowledgeBiteBody>;
};

function createDefaultMetadata(
  title: string,
  categoryId: KnowledgeBiteCategoryId,
  subcategory?: string,
  status: KnowledgeBiteStatus = "draft",
): KnowledgeBiteMetadata {
  return {
    title,
    subtitle: "",
    category: categoryId,
    subcategory,
    difficulty: "beginner",
    readingTimeMinutes: 5,
    tags: [],
    relatedRecipes: [],
    relatedKnowledge: [],
    relatedTips: [],
    status,
  };
}

function createDefaultBody(): KnowledgeBiteBody {
  return {
    summary: "",
    sections: [],
  };
}

/** Creates one editorial section — use when writing real content. */
export function createKnowledgeBiteSection(
  section: KnowledgeBiteSection,
): KnowledgeBiteSection {
  return {
    ...section,
    keyPoints: section.keyPoints ?? [],
    relatedKnowledge: section.relatedKnowledge ?? [],
  };
}

/** Creates a standard layout section with the default Dutch title. */
export function createStandardSection(
  id: KnowledgeBiteSectionId,
  overrides?: Partial<Omit<KnowledgeBiteSection, "id" | "title">> & {
    title?: string;
  },
): KnowledgeBiteSection {
  return createKnowledgeBiteSection({
    id,
    title: overrides?.title ?? getStandardSectionTitle(id),
    body: overrides?.body ?? "",
    keyPoints: overrides?.keyPoints ?? [],
    doughbertTip: overrides?.doughbertTip,
    relatedKnowledge: overrides?.relatedKnowledge ?? [],
    table: overrides?.table,
    comparisonTable: overrides?.comparisonTable,
    quote: overrides?.quote,
    faq: overrides?.faq,
    mistakes: overrides?.mistakes,
    didYouKnow: overrides?.didYouKnow,
  });
}

/** Builds default article metadata and body for unpublished Knowledge Bites. */
export function createDefaultKnowledgeBiteArticle({
  title,
  categoryId,
  subcategory,
  status = "draft",
  metadataOverrides,
  contentOverrides,
}: CreateArticleInput): KnowledgeBiteArticle {
  const metadata = mergeKnowledgeBiteMetadata(
    createDefaultMetadata(title, categoryId, subcategory, status),
    metadataOverrides,
  );

  const content = mergeKnowledgeBiteBody(createDefaultBody(), contentOverrides);

  return { metadata, content };
}

export function mergeKnowledgeBiteMetadata(
  base: KnowledgeBiteMetadata,
  overrides?: Partial<KnowledgeBiteMetadata>,
): KnowledgeBiteMetadata {
  if (!overrides) {
    return base;
  }

  return {
    ...base,
    ...overrides,
    tags: overrides.tags ?? base.tags,
    relatedRecipes: overrides.relatedRecipes ?? base.relatedRecipes,
    relatedKnowledge: overrides.relatedKnowledge ?? base.relatedKnowledge,
    relatedTips: overrides.relatedTips ?? base.relatedTips,
  };
}

export function mergeKnowledgeBiteBody(
  base: KnowledgeBiteBody,
  overrides?: Partial<KnowledgeBiteBody>,
): KnowledgeBiteBody {
  if (!overrides) {
    return base;
  }

  return {
    summary: overrides.summary ?? base.summary,
    sections: overrides.sections ?? base.sections,
    doughbertAdvice: overrides.doughbertAdvice ?? base.doughbertAdvice,
    doughbertAdviceHeaders:
      overrides.doughbertAdviceHeaders ?? base.doughbertAdviceHeaders,
    doughbertAdviceNote: overrides.doughbertAdviceNote ?? base.doughbertAdviceNote,
  };
}

export function mergeKnowledgeBiteArticle(
  base: KnowledgeBiteArticle,
  metadataOverrides?: Partial<KnowledgeBiteMetadata>,
  contentOverrides?: Partial<KnowledgeBiteBody>,
): KnowledgeBiteArticle {
  return {
    metadata: mergeKnowledgeBiteMetadata(base.metadata, metadataOverrides),
    content: mergeKnowledgeBiteBody(base.content, contentOverrides),
  };
}

/** @deprecated Use createDefaultKnowledgeBiteArticle */
export function createPlaceholderKnowledgeBiteArticle(input: CreateArticleInput) {
  return createDefaultKnowledgeBiteArticle(input);
}

/** @deprecated Use createDefaultKnowledgeBiteArticle */
export function createPlaceholderKnowledgeBiteContent(input: CreateArticleInput) {
  return createDefaultKnowledgeBiteArticle(input);
}

/** @deprecated Use mergeKnowledgeBiteArticle */
export function mergeKnowledgeBiteContent(
  base: KnowledgeBiteArticle,
  overrides?: Partial<KnowledgeBiteMetadata & KnowledgeBiteBody>,
) {
  return mergeKnowledgeBiteArticle(
    base,
    overrides,
    overrides
      ? {
          summary: overrides.summary,
          sections: overrides.sections,
        }
      : undefined,
  );
}
