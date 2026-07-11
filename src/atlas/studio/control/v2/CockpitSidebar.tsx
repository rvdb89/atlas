import { Pressable, StyleSheet, Text, View } from "react-native";

import { V2 } from "./v2Theme";

export type CockpitNavId =
  | "control"
  | "inbox"
  | "companies"
  | "agents"
  | "roadmap"
  | "bugs"
  | "memory"
  | "settings";

const NAV_ITEMS: Array<{ id: CockpitNavId; label: string; icon: string }> = [
  { id: "control", label: "Atlas Control", icon: "◆" },
  { id: "inbox", label: "CEO Inbox", icon: "✉" },
  { id: "companies", label: "Companies", icon: "◈" },
  { id: "agents", label: "Agents", icon: "◎" },
  { id: "roadmap", label: "Roadmap", icon: "▣" },
  { id: "bugs", label: "Bugs", icon: "⚠" },
  { id: "memory", label: "Memory", icon: "◉" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export type AppLaunchStatus = "idle" | "checking" | "starting" | "timeout" | "bridge-unreachable" | "popup-blocked";

const APP_LAUNCH_LABEL: Partial<Record<AppLaunchStatus, string>> = {
  checking: "Checken…",
  starting: "Wordt gestart…",
  timeout: "Duurt te lang — check Terminal",
  "bridge-unreachable": "Runtime niet bereikbaar — start npm run atlas:runtime",
  "popup-blocked": "Pop-up geblokkeerd — sta pop-ups toe voor localhost",
};

type CockpitSidebarProps = {
  active: CockpitNavId;
  onSelect: (id: CockpitNavId) => void;
  companyName: string;
  onOpenApp: () => void;
  appLaunchStatus?: AppLaunchStatus;
};

export default function CockpitSidebar({
  active,
  onSelect,
  companyName,
  onOpenApp,
  appLaunchStatus = "idle",
}: CockpitSidebarProps) {
  const appStatusLabel = APP_LAUNCH_LABEL[appLaunchStatus];
  const appLaunchBusy = appLaunchStatus === "checking" || appLaunchStatus === "starting";
  return (
    <View style={styles.shell}>
      <View style={styles.brand}>
        <View style={styles.logoOrb} />
        <View>
          <Text style={styles.brandTitle}>Atlas</Text>
          <Text style={styles.brandSub}>{companyName}</Text>
        </View>
      </View>

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => onSelect(item.id)}
              style={[styles.navItem, isActive && styles.navItemActive]}
            >
              <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{item.icon}</Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}

        <Pressable onPress={onOpenApp} style={styles.navItem} disabled={appLaunchBusy}>
          <Text style={styles.navIcon}>🍞</Text>
          <View style={styles.navAppLabelStack}>
            <Text style={styles.navLabel}>Doughbert app</Text>
            {appStatusLabel ? <Text style={styles.navAppStatus}>{appStatusLabel}</Text> : null}
          </View>
          <Text style={styles.navExternal}>{appLaunchBusy ? "⋯" : "↗"}</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>CEO Operating System</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: V2.sidebarWidth,
    backgroundColor: V2.sidebar,
    borderRightWidth: 1,
    borderRightColor: V2.border,
    paddingTop: 20,
    paddingHorizontal: 14,
    paddingBottom: 16,
    justifyContent: "space-between",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 6,
    marginBottom: 28,
  },

  logoOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: V2.accentSoft,
    borderWidth: 1,
    borderColor: V2.borderGlow,
    shadowColor: V2.accent,
    shadowOpacity: 0.45,
    shadowRadius: 12,
  },

  brandTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: V2.text,
    letterSpacing: 0.5,
  },

  brandSub: {
    marginTop: 2,
    fontSize: 11,
    color: V2.textDim,
    letterSpacing: 0.4,
  },

  nav: {
    flex: 1,
    gap: 4,
  },

  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: V2.radiusSm,
  },

  navItemActive: {
    backgroundColor: V2.sidebarActive,
    borderWidth: 1,
    borderColor: V2.borderGlow,
  },

  navIcon: {
    width: 18,
    fontSize: 13,
    color: V2.textDim,
    textAlign: "center",
  },

  navIconActive: {
    color: V2.accent,
  },

  navLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: V2.textMuted,
  },

  navLabelActive: {
    color: V2.text,
    fontWeight: "700",
  },

  navExternal: {
    fontSize: 12,
    color: V2.textDim,
  },

  navAppLabelStack: {
    flex: 1,
  },

  navAppStatus: {
    marginTop: 1,
    fontSize: 10,
    color: V2.accent,
  },

  footer: {
    paddingHorizontal: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: V2.border,
  },

  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: V2.success,
  },

  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: V2.textDim,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
});
