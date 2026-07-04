import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import KnowledgeBiteArticleView from "@/components/knowledge/article/KnowledgeBiteArticleView";
import ScreenLayout from "@/components/ScreenLayout";
import { getKnowledgeBiteBySlug } from "@/data/knowledgeBites";
import { resolveKnowledgeBackRoute } from "@/utils/knowledgeNavigation";

export default function KnowledgeBiteScreen() {
  const { slug, returnTo } = useLocalSearchParams<{
    slug?: string;
    returnTo?: string | string[];
  }>();
  const biteSlug = typeof slug === "string" ? slug : "";
  const bite = getKnowledgeBiteBySlug(biteSlug);
  const backRoute = resolveKnowledgeBackRoute(returnTo);

  if (!bite) {
    return (
      <ScreenLayout backTo={backRoute} title="Kennisbite" subtitle="Niet gevonden.">
        <View style={styles.panel}>
          <Text style={styles.body}>Deze kennisbite bestaat nog niet.</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      backTo={backRoute}
      title={bite.title}
      subtitle={bite.tagline.trim().length > 0 ? bite.tagline : undefined}
    >
      <KnowledgeBiteArticleView bite={bite} returnTo={bite.route} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#7A6652",
  },
});
