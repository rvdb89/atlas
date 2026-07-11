import { router, usePathname } from "expo-router";
import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PageNav from "@/components/PageNav";
import { BakeryColors, BakeryFonts } from "@/constants/theme";

const COLORS = {
  cream: BakeryColors.cream,
  warmWhite: BakeryColors.warmWhite,
  brown: BakeryColors.brown,
  secondary: BakeryColors.textSecondary,
  orangeAccent: BakeryColors.orangeAccent,
  navInactive: BakeryColors.navInactive,
};

const HORIZONTAL_PADDING = 24;
const BOTTOM_NAV_CONTENT_HEIGHT = 68;
const SCROLL_EXTRA_PADDING = 48;

type NavHref = "/" | "/planner" | "/recipes" | "/knowledge" | "/starter" | "/profile";

type NavItemConfig = {
  icon: string;
  label: string;
  href: NavHref;
};

const NAV_ITEMS: NavItemConfig[] = [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🕘", label: "Planner", href: "/planner" },
  { icon: "📖", label: "Recepten", href: "/recipes" },
  { icon: "📚", label: "Knowledge", href: "/knowledge" },
  { icon: "🫙", label: "Starter", href: "/starter" },
  { icon: "👤", label: "Profiel", href: "/profile" },
];

type ScreenLayoutProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  onBack?: () => void;
  headerExtra?: ReactNode;
  children: ReactNode;
};

function resolveActiveNav(pathname: string): NavHref | null {
  if (pathname === "/") return "/";
  if (pathname.startsWith("/planner")) return "/planner";
  if (pathname === "/recipes") return "/recipes";
  if (pathname.startsWith("/knowledge")) return "/knowledge";
  if (pathname === "/starter") return "/starter";
  if (pathname === "/profile") return "/profile";

  return null;
}

export default function ScreenLayout({
  title,
  subtitle,
  backTo,
  onBack,
  headerExtra,
  children,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const activeNav = resolveActiveNav(pathname);

  const bottomNavPadding = Math.max(insets.bottom, 14);
  const bottomNavTotalHeight = BOTTOM_NAV_CONTENT_HEIGHT + bottomNavPadding;
  const scrollBottomPadding = bottomNavTotalHeight + SCROLL_EXTRA_PADDING;
  const topPadding = Math.max(insets.top, 20) + 12;

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPadding,
            paddingBottom: scrollBottomPadding,
          },
        ]}
      >
        {backTo ? (
          <PageNav backTo={backTo} />
        ) : onBack ? (
          <ScreenHeader onBack={onBack} />
        ) : null}

        {headerExtra}

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        {children}
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: bottomNavPadding }]}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.href;

          return (
            <BottomNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={isActive}
              onPress={
                isActive ? undefined : () => router.push(item.href)
              }
            />
          );
        })}
      </View>
    </View>
  );
}

function ScreenHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack}>
        <Text style={styles.headerLink}>← Terug</Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/")}>
        <Text style={styles.headerLink}>🏠 Home</Text>
      </Pressable>
    </View>
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
      disabled={!onPress}
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
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  headerLink: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.secondary,
  },

  title: {
    fontFamily: BakeryFonts.display,
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.brown,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.secondary,
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
