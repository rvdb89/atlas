import { router } from "expo-router";
import { useMemo } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  cream: "#F7F1E8",
  warmWhite: "#FFFDF8",
  card: "#F8F0E6",
  brown: "#2B2118",
  brownMuted: "#5F4A3B",
  orange: "#B85F1D",
  orangeAccent: "#B86B38",
  peach: "#F3D1A5",
  navInactive: "#9B928A",
};

const PANEL_MARGIN = 24;
const PANEL_PADDING = 22;
const GRID_GAP = 14;
const PANEL_OVERLAP = 20;
const BOTTOM_NAV_CONTENT_HEIGHT = 68;
const SCROLL_EXTRA_PADDING = 48;

type AppRoute =
  | "/bread"
  | "/pizza"
  | "/starter"
  | "/planner"
  | "/recipes"
  | "/tips";

type HomeCardItem = {
  emoji: string;
  title: string;
  text: string;
  href: AppRoute;
};

const HOME_CARDS: HomeCardItem[] = [
  {
    emoji: "🍞",
    title: "Brood",
    text: "Van klassiek wit tot robuust rogge.",
    href: "/bread",
  },
  {
    emoji: "🍕",
    title: "Pizza",
    text: "Maak de perfecte pizzabodem.",
    href: "/pizza",
  },
  {
    emoji: "🫙",
    title: "Mijn Starter",
    text: "Houd je starter gezond en sterk.",
    href: "/starter",
  },
  {
    emoji: "📅",
    title: "Bake Planner",
    text: "Plan jouw bakmoment.",
    href: "/planner",
  },
  {
    emoji: "📖",
    title: "Recepten",
    text: "Ontdek en bewaar recepten.",
    href: "/recipes",
  },
  {
    emoji: "💡",
    title: "Tips & Kennis",
    text: "Word elke dag beter.",
    href: "/tips",
  },
];

type NavItemConfig = {
  icon: string;
  label: string;
  href?: "/" | "/planner";
  active?: boolean;
};

const NAV_ITEMS: NavItemConfig[] = [
  { icon: "🏠", label: "Home", href: "/", active: true },
  { icon: "🕘", label: "Planner", href: "/planner" },
  { icon: "📖", label: "Recepten" },
  { icon: "🫙", label: "Starter" },
  { icon: "👤", label: "Profiel" },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const columns = Platform.OS === "web" && width >= 640 ? 3 : 2;
  const panelWidth = Math.min(width - PANEL_MARGIN * 2, 860);
  const cardWidth =
    (panelWidth - PANEL_PADDING * 2 - GRID_GAP * (columns - 1)) / columns;

  const bottomNavPadding = Math.max(insets.bottom, 14);
  const bottomNavTotalHeight = BOTTOM_NAV_CONTENT_HEIGHT + bottomNavPadding;
  const scrollBottomPadding = bottomNavTotalHeight + SCROLL_EXTRA_PADDING;

  const heroTopPadding = useMemo(
    () => Math.max(insets.top, Platform.OS === "web" ? 48 : 20) + 24,
    [insets.top],
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: scrollBottomPadding },
        ]}
      >
        <ImageBackground
          source={require("../../assets/images/hero afbeelding.png")}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroFade} />
          <View style={[styles.heroOverlay, { paddingTop: heroTopPadding }]}>
            <Text style={styles.greeting}>👋 Goedemorgen Bakker.</Text>
            <Text style={styles.heroTitle}>
              Wat gaan wij{"\n"}vandaag maken?
            </Text>
            <Text style={styles.heroSubtitle}>
              Bakken is geduld, aandacht en een beetje magie.
            </Text>
          </View>
        </ImageBackground>

        <View style={[styles.panel, { width: panelWidth }]}>
          <Text style={styles.panelTitle}>Kies waar je zin in hebt.</Text>

          <View style={styles.grid}>
            {HOME_CARDS.map((card) => (
              <HomeCard
                key={card.title}
                emoji={card.emoji}
                title={card.title}
                text={card.text}
                width={cardWidth}
                onPress={() => router.push(card.href)}
              />
            ))}
          </View>

          <View style={styles.quote}>
            <Text style={styles.quoteIcon}>✨</Text>
            <View style={styles.quoteCopy}>
              <Text style={styles.quoteText}>
                Bakken is geduld, aandacht en een beetje magie.
              </Text>
              <Text style={styles.quoteBold}>
                Wij doen de planning, jij geniet.
              </Text>
            </View>
            <Text style={styles.quoteHeart}>🧡</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          { paddingBottom: bottomNavPadding },
        ]}
      >
        {NAV_ITEMS.map((item) => {
          const href = item.href;

          return (
            <BottomNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onPress={
                href && !item.active ? () => router.push(href) : undefined
              }
            />
          );
        })}
      </View>
    </View>
  );
}

function HomeCard({
  emoji,
  title,
  text,
  width,
  onPress,
}: {
  emoji: string;
  title: string;
  text: string;
  width: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
      <Text style={styles.cardArrow}>›</Text>
    </Pressable>
  );
}

function BottomNavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
      disabled={!onPress && !active}
    >
      <Text style={styles.navIcon}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
      {active ? <View style={styles.navActiveDot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },

  hero: {
    width: "100%",
    height: Platform.select({ web: 680, default: 580 }),
    justifyContent: "flex-start",
    overflow: "hidden",
  },

  heroImage: Platform.select({
    web: {
      resizeMode: "cover",
      width: "100%",
      height: "100%",
      objectPosition: "center 38%",
    },
    default: {
      resizeMode: "cover",
      width: "100%",
      height: "132%",
      transform: [{ translateY: -72 }],
    },
  }),

  heroFade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255, 244, 229, 0.22)",
  },

  heroOverlay: {
    paddingHorizontal: 32,
    maxWidth: 560,
  },

  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.orange,
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: Platform.select({ web: 50, default: 40 }),
    lineHeight: Platform.select({ web: 56, default: 46 }),
    fontWeight: "900",
    color: COLORS.brown,
    maxWidth: 520,
  },

  heroSubtitle: {
    marginTop: 18,
    fontSize: Platform.select({ web: 22, default: 17 }),
    lineHeight: Platform.select({ web: 31, default: 24 }),
    color: COLORS.brown,
    maxWidth: 400,
  },

  panel: {
    marginTop: -PANEL_OVERLAP,
    marginHorizontal: PANEL_MARGIN,
    backgroundColor: COLORS.warmWhite,
    borderRadius: 32,
    padding: PANEL_PADDING,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  panelTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.brown,
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },

  card: {
    minHeight: 210,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },

  cardEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.brown,
    textAlign: "center",
  },

  cardText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.brownMuted,
    textAlign: "center",
  },

  cardArrow: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.orangeAccent,
  },

  quote: {
    marginTop: 22,
    backgroundColor: COLORS.peach,
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  quoteIcon: {
    fontSize: 34,
  },

  quoteCopy: {
    flex: 1,
  },

  quoteText: {
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.brown,
  },

  quoteBold: {
    marginTop: 4,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "900",
    color: COLORS.brown,
  },

  quoteHeart: {
    fontSize: 32,
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.warmWhite,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 12,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 54,
  },

  navIcon: {
    fontSize: 24,
  },

  navLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.navInactive,
  },

  navLabelActive: {
    color: COLORS.orangeAccent,
  },

  navActiveDot: {
    marginTop: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.orangeAccent,
  },
});
