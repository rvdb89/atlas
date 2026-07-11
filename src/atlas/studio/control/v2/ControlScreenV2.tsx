import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { APP_URL } from "@/atlas/config/ports";

import { useStudioBootstrap } from "../../hooks/useStudioBootstrap";
import { openAppTab, openOrLaunchApp } from "../appLauncher";
import { useControlDashboard } from "../useControlDashboard";
import ActivityFeedV2 from "./ActivityFeedV2";
import AiHeart from "./AiHeart";
import BugsSectionV2 from "./BugsSectionV2";
import CeoInboxV2 from "./CeoInboxV2";
import CockpitSidebar, { type CockpitNavId } from "./CockpitSidebar";
import CommandPanel from "./CommandPanel";
import CompanyPortfolioV2 from "./CompanyPortfolioV2";
import HeroSection from "./HeroSection";
import KpiStrip from "./KpiStrip";
import LivePlanSectionV2 from "./LivePlanSectionV2";
import ManagementTeamV2 from "./ManagementTeamV2";
import MemorySectionV2 from "./MemorySectionV2";
import RoadmapV2 from "./RoadmapV2";
import { V2 } from "./v2Theme";

export type AppLaunchStatus = "idle" | "checking" | "starting" | "timeout" | "bridge-unreachable" | "popup-blocked";

export default function ControlScreenV2() {
  useStudioBootstrap();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const showSidebar = width >= 900;
  const showCommandRail = width >= 1180;
  const [activeNav, setActiveNav] = useState<CockpitNavId>("control");

  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Partial<Record<CockpitNavId, number>>>({});
  const [appLaunchStatus, setAppLaunchStatus] = useState<AppLaunchStatus>("idle");

  // Bugfix 2026-07-10 · Used to be a bare window.open(APP_URL) — if the app's dev server
  // wasn't already running as a separate manual process, that landed on a blank
  // ERR_CONNECTION_REFUSED tab with no explanation and no way to fix it from here. First fix
  // (checking liveness before opening) introduced a second bug: awaiting anything before
  // window.open() makes the browser treat it as no longer user-initiated, so the popup
  // blocker silently ate the call — nothing opened, no error. Fixed by opening the tab
  // synchronously first (openAppTab, still inside this click handler's own call stack) and
  // only doing the async liveness/launch/poll work against that already-open window.
  const openDoughbertApp = useCallback(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    if (appLaunchStatus === "checking" || appLaunchStatus === "starting") return;

    const win = openAppTab();
    void openOrLaunchApp("doughbert", APP_URL, win, setAppLaunchStatus).then((outcome) => {
      setAppLaunchStatus(
        outcome === "opened"
          ? "idle"
          : outcome === "starting-timeout"
            ? "timeout"
            : outcome === "popup-blocked"
              ? "popup-blocked"
              : "bridge-unreachable",
      );
    });
  }, [appLaunchStatus]);

  const handleSectionLayout = (id: CockpitNavId) => (event: LayoutChangeEvent) => {
    sectionOffsets.current[id] = event.nativeEvent.layout.y;
  };

  const handleNavSelect = (id: CockpitNavId) => {
    setActiveNav(id);

    if (id === "settings") {
      router.push("/studio/settings");
      return;
    }

    const y = id === "control" ? 0 : sectionOffsets.current[id];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
    }
  };

  const {
    snapshot,
    loading,
    error,
    adjustingItemId,
    setAdjustingItemId,
    approveInbox,
    adjustInbox,
    deferInbox,
    primaryCommandAction,
    secondaryCommandAction,
  } = useControlDashboard();

  const topPending = snapshot?.ceoInbox.find((item) => item.status === "pending");

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.bgGlowPrimary} />
      <View style={styles.bgGlowSecondary} />

      <View style={styles.cockpitRow}>
        {showSidebar && snapshot ? (
          <CockpitSidebar
            active={activeNav}
            onSelect={handleNavSelect}
            companyName={snapshot.companyName}
            onOpenApp={openDoughbertApp}
            appLaunchStatus={appLaunchStatus}
          />
        ) : null}

        <View style={styles.main}>
          {error ? (
            <View style={[styles.errorBox, styles.mainPadding]}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {loading || !snapshot ? (
            <View style={styles.loading}>
              <ActivityIndicator color={V2.accent} size="large" />
              <Text style={styles.loadingText}>Booting Atlas CEO Cockpit…</Text>
            </View>
          ) : (
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: insets.bottom + 40 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.mainPadding, styles.contentRow]}>
                <View style={styles.centerColumn}>
                  <HeroSection
                    snapshot={snapshot}
                    onPrimary={primaryCommandAction}
                    onSecondary={secondaryCommandAction}
                  />

                  <KpiStrip snapshot={snapshot} />

                  <AiHeart companyHealth={snapshot.companyState.companyHealth} />

                  <View style={styles.sectionGap} onLayout={handleSectionLayout("livePlan")}>
                    <LivePlanSectionV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap} onLayout={handleSectionLayout("inbox")}>
                    <CeoInboxV2
                      snapshot={snapshot}
                      adjustingItemId={adjustingItemId}
                      onApprove={approveInbox}
                      onAdjustClick={setAdjustingItemId}
                      onAdjustOption={adjustInbox}
                      onLater={deferInbox}
                    />
                  </View>

                  <View style={styles.sectionGap} onLayout={handleSectionLayout("agents")}>
                    <ManagementTeamV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap} onLayout={handleSectionLayout("companies")}>
                    <CompanyPortfolioV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap} onLayout={handleSectionLayout("roadmap")}>
                    <RoadmapV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap} onLayout={handleSectionLayout("bugs")}>
                    <BugsSectionV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap} onLayout={handleSectionLayout("memory")}>
                    <MemorySectionV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap}>
                    <ActivityFeedV2 snapshot={snapshot} />
                  </View>

                  {!showCommandRail ? (
                    <View style={styles.sectionGap}>
                      <CommandPanel
                        snapshot={snapshot}
                        onPrimary={primaryCommandAction}
                        onSecondary={secondaryCommandAction}
                        onApproveTop={topPending ? () => approveInbox(topPending.id) : undefined}
                      />
                    </View>
                  ) : null}
                </View>

                {showCommandRail ? (
                  <View style={styles.commandColumn}>
                    <CommandPanel
                      snapshot={snapshot}
                      onPrimary={primaryCommandAction}
                      onSecondary={secondaryCommandAction}
                      onApproveTop={topPending ? () => approveInbox(topPending.id) : undefined}
                    />
                  </View>
                ) : null}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V2.bg,
  },

  bgGlowPrimary: {
    position: "absolute",
    top: -120,
    left: "30%",
    width: 400,
    height: 300,
    borderRadius: 999,
    backgroundColor: V2.accentGlow,
    opacity: 0.12,
  },

  bgGlowSecondary: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 360,
    height: 360,
    borderRadius: 999,
    backgroundColor: V2.purpleSoft,
    opacity: 0.08,
  },

  cockpitRow: {
    flex: 1,
    flexDirection: "row",
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  mainPadding: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  scrollContent: {
    flexGrow: 1,
  },

  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
    maxWidth: 1500,
    width: "100%",
    alignSelf: "center",
  },

  centerColumn: {
    flex: 1,
    minWidth: 0,
  },

  commandColumn: {
    width: V2.commandWidth,
    flexShrink: 0,
  },

  sectionGap: {
    marginBottom: 16,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingVertical: 80,
  },

  loadingText: {
    fontSize: 14,
    color: V2.textMuted,
    letterSpacing: 0.3,
  },

  errorBox: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: V2.dangerSoft,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.35)",
  },

  errorText: {
    color: V2.danger,
    fontSize: 14,
    fontWeight: "600",
  },
});
