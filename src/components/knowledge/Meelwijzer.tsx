import { router, type Href } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import {
  getFlourGuideBiteRoute,
  MEELWIJZER_GROUPS,
  MEELWIJZER_HEADERS,
  MEELWIJZER_TITLE,
  type FlourGuideEntry,
} from "@/data/knowledge/flour/flourGuide";
import { buildKnowledgeBiteHref } from "@/utils/knowledgeNavigation";

import { KNOWLEDGE_COLORS, knowledgeStyles } from "./knowledgeStyles";

const WIDE_LAYOUT_MIN_WIDTH = 720;

const COLUMN_WIDTHS = {
  name: 118,
  rating: 88,
  water: 108,
  difficulty: 96,
  use: 148,
} as const;

const SCROLLABLE_TABLE_MIN_WIDTH =
  COLUMN_WIDTHS.name +
  COLUMN_WIDTHS.rating +
  COLUMN_WIDTHS.water +
  COLUMN_WIDTHS.difficulty +
  COLUMN_WIDTHS.use;

type MeelwijzerProps = {
  returnTo: string;
};

export default function Meelwijzer({ returnTo }: MeelwijzerProps) {
  const { width } = useWindowDimensions();
  const isWideLayout = width >= WIDE_LAYOUT_MIN_WIDTH;

  const tableBody = MEELWIJZER_GROUPS.map((group, groupIndex) => {
    const isLastGroup = groupIndex === MEELWIJZER_GROUPS.length - 1;

    return (
      <View key={group.title}>
        <View style={styles.groupHeaderRow}>
          <Text style={styles.groupHeaderText}>{group.title}</Text>
        </View>

        {group.entries.map((entry, entryIndex) => {
          const isLastRow =
            isLastGroup && entryIndex === group.entries.length - 1;

          return (
            <MeelwijzerDataRow
              key={entry.slug}
              entry={entry}
              isWideLayout={isWideLayout}
              isLast={isLastRow}
              returnTo={returnTo}
            />
          );
        })}
      </View>
    );
  });

  const table = (
    <View
      style={[
        knowledgeStyles.tableWrapper,
        !isWideLayout && styles.scrollableTable,
        { marginTop: 0 },
      ]}
    >
      <MeelwijzerHeaderRow isWideLayout={isWideLayout} />

      {tableBody}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{MEELWIJZER_TITLE}</Text>
      <Text style={styles.intro}>
        Vergelijk alle meelsoorten in één oogopslag. Tik op een rij om de volledige
        Knowledge Bite te openen.
      </Text>

      {isWideLayout ? (
        table
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {table}
        </ScrollView>
      )}
    </View>
  );
}

function MeelwijzerHeaderRow({ isWideLayout }: { isWideLayout: boolean }) {
  return (
    <View style={knowledgeStyles.tableRow}>
      <MeelwijzerCell
        isWideLayout={isWideLayout}
        isHeader
        widthKey="name"
        text={MEELWIJZER_HEADERS[0]}
      />
      <MeelwijzerCell
        isWideLayout={isWideLayout}
        isHeader
        widthKey="rating"
        text={MEELWIJZER_HEADERS[1]}
      />
      <MeelwijzerCell
        isWideLayout={isWideLayout}
        isHeader
        widthKey="water"
        text={MEELWIJZER_HEADERS[2]}
      />
      <MeelwijzerCell
        isWideLayout={isWideLayout}
        isHeader
        widthKey="difficulty"
        text={MEELWIJZER_HEADERS[3]}
      />
      <MeelwijzerCell
        isWideLayout={isWideLayout}
        isHeader
        widthKey="use"
        text={MEELWIJZER_HEADERS[4]}
      />
    </View>
  );
}

function MeelwijzerDataRow({
  entry,
  isWideLayout,
  isLast,
  returnTo,
}: {
  entry: FlourGuideEntry;
  isWideLayout: boolean;
  isLast: boolean;
  returnTo: string;
}) {
  const route = buildKnowledgeBiteHref(getFlourGuideBiteRoute(entry.slug), returnTo);

  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.rowPressed]}
      onPress={() => router.push(route as Href)}
    >
      <View style={[knowledgeStyles.tableRow, isLast && styles.lastRow]}>
        <MeelwijzerCell
          isWideLayout={isWideLayout}
          widthKey="name"
          text={entry.name}
          emphasized
        />
        <MeelwijzerCell
          isWideLayout={isWideLayout}
          widthKey="rating"
          text={entry.flavor}
        />
        <MeelwijzerCell
          isWideLayout={isWideLayout}
          widthKey="water"
          text={entry.waterAbsorption}
        />
        <MeelwijzerCell
          isWideLayout={isWideLayout}
          widthKey="difficulty"
          text={entry.difficulty}
        />
        <MeelwijzerCell
          isWideLayout={isWideLayout}
          widthKey="use"
          text={entry.bestUse}
        />
      </View>
    </Pressable>
  );
}

function MeelwijzerCell({
  text,
  isWideLayout,
  isHeader = false,
  widthKey,
  emphasized = false,
}: {
  text: string;
  isWideLayout: boolean;
  isHeader?: boolean;
  widthKey: keyof typeof COLUMN_WIDTHS;
  emphasized?: boolean;
}) {
  const width = COLUMN_WIDTHS[widthKey];

  return (
    <View
      style={[
        isHeader ? knowledgeStyles.tableHeaderCell : knowledgeStyles.tableCell,
        isWideLayout ? styles.wideCell : { width },
      ]}
    >
      <Text
        style={[
          isHeader ? knowledgeStyles.tableHeaderText : knowledgeStyles.tableCellText,
          emphasized && styles.emphasizedCellText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: KNOWLEDGE_COLORS.warmWhite,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: KNOWLEDGE_COLORS.brown,
    marginBottom: 8,
  },

  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: KNOWLEDGE_COLORS.secondary,
    marginBottom: 16,
  },

  scrollContent: {
    paddingRight: 4,
  },

  scrollableTable: {
    minWidth: SCROLLABLE_TABLE_MIN_WIDTH,
  },

  groupHeaderRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(184, 107, 56, 0.08)",
    backgroundColor: KNOWLEDGE_COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  groupHeaderText: {
    fontSize: 12,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  wideCell: {
    flex: 1,
  },

  emphasizedCellText: {
    fontWeight: "800",
  },

  rowPressed: {
    opacity: 0.92,
  },

  lastRow: {
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
});
