import { router, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { buildKnowledgeBiteHref } from "@/utils/knowledgeNavigation";

import { knowledgeStyles } from "../knowledgeStyles";

export type RelatedLinkItem = {
  id: string;
  title: string;
  subtitle?: string;
  route: string;
};

type KnowledgeBiteRelatedGroupProps = {
  title: string;
  items: RelatedLinkItem[];
  returnTo?: string;
  linkReturnTo?: boolean;
};

export default function KnowledgeBiteRelatedGroup({
  title,
  items,
  returnTo,
  linkReturnTo = false,
}: KnowledgeBiteRelatedGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={knowledgeStyles.relatedGroup}>
      {title ? <Text style={knowledgeStyles.relatedGroupTitle}>{title}</Text> : null}
      {items.map((item) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            knowledgeStyles.relatedCard,
            pressed && knowledgeStyles.relatedCardPressed,
          ]}
          onPress={() => {
            const href =
              linkReturnTo && returnTo
                ? buildKnowledgeBiteHref(item.route, returnTo)
                : item.route;

            router.push(href as Href);
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={knowledgeStyles.relatedCardTitle}>{item.title}</Text>
            {item.subtitle ? (
              <Text style={knowledgeStyles.relatedCardSubtitle}>{item.subtitle}</Text>
            ) : null}
          </View>
          <Text style={knowledgeStyles.relatedCardArrow}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}
