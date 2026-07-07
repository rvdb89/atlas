import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStudioBootstrap } from "../../hooks/useStudioBootstrap";
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
import ManagementTeamV2 from "./ManagementTeamV2";
import MemorySectionV2 from "./MemorySectionV2";
import RoadmapV2 from "./RoadmapV2";
import { V2 } from "./v2Theme";

export default function ControlScreenV2() {
  useStudioBootstrap();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const showSidebar = width >= 900;
  const showCommandRail = width >= 1180;
  const [activeNav, setActiveNav] = useState<CockpitNavId>("control");

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
            onSelect={setActiveNav}
            companyName={snapshot.companyName}
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

                  <View style={styles.sectionGap}>
                    <CeoInboxV2
                      snapshot={snapshot}
                      adjustingItemId={adjustingItemId}
                      onApprove={approveInbox}
                      onAdjustClick={setAdjustingItemId}
                      onAdjustOption={adjustInbox}
                      onLater={deferInbox}
                    />
                  </View>

                  <View style={styles.sectionGap}>
                    <ManagementTeamV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap}>
                    <CompanyPortfolioV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap}>
                    <RoadmapV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap}>
                    <BugsSectionV2 snapshot={snapshot} />
                  </View>

                  <View style={styles.sectionGap}>
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
