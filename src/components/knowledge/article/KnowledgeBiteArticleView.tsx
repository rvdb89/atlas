import { useMemo } from "react";
import { View } from "react-native";

import { getKnowledgeBite } from "@/data/knowledgeBites";
import { getRecipe } from "@/data/recipes";
import { tips } from "@/data/tips";
import type { KnowledgeBite } from "@/types/knowledgeBite";
import {
  getVisibleSections,
  hasDoughbertAdvice,
  hasText,
} from "@/utils/knowledgeContentVisibility";

import KnowledgeSection from "../KnowledgeSection";
import KnowledgeBiteDoughbertAdvice, {
  DOUGHBERT_ADVICE_SECTION_TITLE,
} from "./KnowledgeBiteDoughbertAdvice";
import KnowledgeBiteMetaBar, {
  KnowledgeBiteSummaryCard,
} from "./KnowledgeBiteMetaBar";
import KnowledgeBiteRelatedGroup, {
  type RelatedLinkItem,
} from "./KnowledgeBiteRelatedGroup";
import KnowledgeBiteSectionContent from "./KnowledgeBiteSectionContent";

type KnowledgeBiteArticleViewProps = {
  bite: KnowledgeBite;
  returnTo?: string;
};

export default function KnowledgeBiteArticleView({
  bite,
  returnTo,
}: KnowledgeBiteArticleViewProps) {
  const visibleSections = useMemo(
    () => getVisibleSections(bite.content.sections),
    [bite.content.sections],
  );

  const relatedKnowledge = useMemo((): RelatedLinkItem[] => {
    const items: RelatedLinkItem[] = [];

    for (const id of bite.metadata.relatedKnowledge) {
      const related = getKnowledgeBite(id);
      if (!related) {
        continue;
      }

      items.push({
        id,
        title: related.title,
        subtitle: hasText(related.tagline) ? related.tagline : undefined,
        route: related.route,
      });
    }

    return items;
  }, [bite.metadata.relatedKnowledge]);

  const relatedRecipes = useMemo((): RelatedLinkItem[] => {
    const items: RelatedLinkItem[] = [];

    for (const id of bite.metadata.relatedRecipes) {
      const recipe = getRecipe(id);
      if (!recipe) {
        continue;
      }

      items.push({
        id,
        title: recipe.name,
        subtitle: recipe.tagline,
        route: recipe.route,
      });
    }

    return items;
  }, [bite.metadata.relatedRecipes]);

  const relatedTips = useMemo((): RelatedLinkItem[] => {
    const items: RelatedLinkItem[] = [];

    for (const id of bite.metadata.relatedTips) {
      const tip = tips[id];
      if (!tip) {
        continue;
      }

      items.push({
        id,
        title: "Tip",
        subtitle: tip.text,
        route: `/tips/category/${tip.categoryId}`,
      });
    }

    return items;
  }, [bite.metadata.relatedTips]);

  return (
    <View>
      <KnowledgeBiteMetaBar bite={bite} />
      <KnowledgeBiteSummaryCard summary={bite.content.summary} />

      {visibleSections.map((section, index) => (
        <KnowledgeSection
          key={`${section.id ?? section.title}-${index}`}
          title={section.title}
          defaultExpanded={index === 0}
        >
          <KnowledgeBiteSectionContent section={section} />
        </KnowledgeSection>
      ))}

      {hasDoughbertAdvice(bite.content.doughbertAdvice) ? (
        <KnowledgeSection title={DOUGHBERT_ADVICE_SECTION_TITLE} defaultExpanded={false}>
          <KnowledgeBiteDoughbertAdvice
            rows={bite.content.doughbertAdvice!}
            headers={bite.content.doughbertAdviceHeaders}
            note={bite.content.doughbertAdviceNote}
          />
        </KnowledgeSection>
      ) : null}

      {relatedKnowledge.length > 0 ? (
        <KnowledgeSection title="Gerelateerde Knowledge Bites" defaultExpanded={false}>
          <KnowledgeBiteRelatedGroup
            title=""
            items={relatedKnowledge}
            returnTo={returnTo}
            linkReturnTo
          />
        </KnowledgeSection>
      ) : null}

      {relatedRecipes.length > 0 ? (
        <KnowledgeSection title="Gerelateerde Recepten" defaultExpanded={false}>
          <KnowledgeBiteRelatedGroup title="" items={relatedRecipes} />
        </KnowledgeSection>
      ) : null}

      {relatedTips.length > 0 ? (
        <KnowledgeSection title="Gerelateerde Tips & Tricks" defaultExpanded={false}>
          <KnowledgeBiteRelatedGroup title="" items={relatedTips} />
        </KnowledgeSection>
      ) : null}
    </View>
  );
}
