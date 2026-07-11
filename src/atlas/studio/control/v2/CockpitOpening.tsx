import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import { URGENCY_LABELS } from "../types";
import {
  composeBriefing,
  composeOpeningVerdict,
  describeHeaderStatus,
  selectMostImportantInboxItem,
  summarizeRecentWork,
} from "./cockpitOpeningHelpers";
import StatusPill from "./StatusPill";
import V2Button from "./V2Button";
import { healthTone, timeGreeting, urgencyTone, V2 } from "./v2Theme";

type CockpitOpeningProps = {
  snapshot: ControlSnapshot;
  onApprove: (id: string) => void;
  onViewInbox: () => void;
  onViewActivity: () => void;
};

/** CEO_COCKPIT.md v1.0 — Chapters 1-5, "Cockpit Opening". One coherent first moment, not five
 * separate cards: greeting + living opening verdict, the daily briefing, "While You Were Away",
 * and — only if one genuinely exists — the single most important decision waiting for the CEO. Replaces
 * HeroSection.tsx (see Atlas Control v3 implementation plan, reviewed 2026-07-11).
 *
 * CEO decision 2026-07-11: "De Cockpit schrijft een briefing. Niet een rapport." Every zone here
 * composes short text from short fields (see cockpitOpeningHelpers.ts) — `numberOfLines` only
 * appears as a last-resort safety net, never as the primary way length is controlled. The
 * Briefing zone deliberately has no "Read more" / Deep Dive link: no such destination exists yet,
 * and CEO_COCKPIT.md chapter 8 is explicitly not being half-built to manufacture one. */
export default function CockpitOpening({ snapshot, onApprove, onViewInbox, onViewActivity }: CockpitOpeningProps) {
  const state = snapshot.companyState;
  const greeting = timeGreeting();
  const topDecision = selectMostImportantInboxItem(snapshot.ceoInbox);
  const hasEscalation = topDecision !== undefined;
  const recent = summarizeRecentWork(snapshot.appliedHistory, snapshot.activity);
  const opening = composeOpeningVerdict(snapshot.companyName, state, recent, hasEscalation);
  const headerStatus = describeHeaderStatus(state, hasEscalation);
  const tone = healthTone(state.companyHealth);
  const briefing = composeBriefing(snapshot.atlasAdvice, state);

  return (
    <View style={styles.shell}>
      <View style={styles.glowTop} />
      <View style={styles.glowSide} />

      {/* A — Greeting + living opening verdict. Composed from what Atlas actually did (see
          composeOpeningVerdict) so this reads like walking into a company that's been working,
          not a bare status label. The health *judgment* still exists — it drives the pill
          (`describeHeaderStatus`/`healthTone`) and surfaces as `note` whenever something
          genuinely needs the CEO, gated on `hasEscalation` so it can never say "attention" while
          Needs You says nothing needs the CEO — see bugfix note in cockpitOpeningHelpers.ts. */}
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>Robbert AI · CEO Cockpit</Text>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.healthSentence}>{opening.verdict}</Text>
          {opening.note ? <Text style={styles.healthNote}>{opening.note}</Text> : null}
        </View>
        <StatusPill label={headerStatus} tone={tone} />
      </View>

      {/* B — The Briefing. Composed from short fields only (composeBriefing) — never the CEO's
          own judgment truncated. No link: no Deep Dive destination exists yet for this zone. */}
      <View style={styles.block}>
        <Text style={styles.blockEyebrow}>Briefing</Text>
        {briefing.map((sentence, index) => (
          <Text key={index} style={styles.briefingText} numberOfLines={1}>
            {sentence}
          </Text>
        ))}
      </View>

      {/* C — While You Were Away (CEO decision 2026-07-11; renamed from "Recent progress" — see
          summarizeRecentWork's doc comment for the honesty note on that framing). Real applied
          work only; an honest "nothing changed" is a valid, meaningful answer. One summary
          sentence, then up to 3 short bullets, then a quiet link to the full Activity Feed. */}
      <View style={styles.block}>
        <Text style={styles.blockEyebrow}>While you were away</Text>
        <Text style={styles.recentSummary}>{recent.summary}</Text>
        {recent.lines.map((line, index) => (
          <Text key={index} style={styles.recentLine} numberOfLines={1}>
            · {line}
          </Text>
        ))}
        <Text style={styles.activityLink} onPress={onViewActivity}>
          View Activity Feed →
        </Text>
      </View>

      {/* D — Needs You. Only the single most important escalated decision (see
          selectMostImportantInboxItem / groupCeoInboxItems), never just "the first pending
          item". An honest "nothing needs you" is shown when that is true. */}
      <View style={[styles.block, styles.blockLast]}>
        <Text style={styles.blockEyebrow}>Needs you</Text>
        {topDecision ? (
          <View>
            <View style={styles.decisionHeader}>
              <Text style={styles.decisionTitle}>{topDecision.title}</Text>
              <StatusPill
                label={URGENCY_LABELS[topDecision.urgency]}
                tone={urgencyTone(topDecision.urgency)}
              />
            </View>
            <Text style={styles.decisionReason} numberOfLines={1}>
              {topDecision.reason}
            </Text>
            {topDecision.applyWarning ? (
              <Text style={styles.attentionWarning}>⚠ {topDecision.applyWarning}</Text>
            ) : null}
            <View style={styles.actions}>
              {/* Same rule as CeoInboxV2: an Approve action only makes sense while the item is
                  still genuinely pending. An `attention` item (applyWarning set) is already
                  approved — its problem is that the apply itself failed, not that it needs a
                  decision — so it only gets a link into the full Inbox, no Approve button. */}
              {topDecision.status === "pending" ? (
                <V2Button label="Approve" onPress={() => onApprove(topDecision.id)} variant="success" compact />
              ) : null}
              <V2Button label="View CEO Inbox" onPress={onViewInbox} variant="secondary" compact />
            </View>
          </View>
        ) : (
          <Text style={styles.recentLine}>Nothing needs your attention right now.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: 16,
    padding: 24,
    borderRadius: V2.radiusLg,
    backgroundColor: V2.bgGlass,
    borderWidth: 1,
    borderColor: V2.borderGlow,
    overflow: "hidden",
    position: "relative",
  },

  glowTop: {
    position: "absolute",
    top: -80,
    left: "20%",
    width: 280,
    height: 160,
    borderRadius: 999,
    backgroundColor: V2.accentGlow,
    opacity: 0.25,
  },

  glowSide: {
    position: "absolute",
    bottom: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: V2.purpleSoft,
    opacity: 0.35,
  },

  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  copy: {
    flex: 1,
    minWidth: 260,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: V2.accent,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  greeting: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: "900",
    color: V2.text,
    letterSpacing: -0.5,
  },

  healthSentence: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
    color: V2.textMuted,
    maxWidth: 520,
  },

  healthNote: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: V2.textDim,
    maxWidth: 520,
  },

  block: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: V2.border,
  },

  blockLast: {
    marginBottom: 0,
  },

  blockEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.textDim,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  briefingText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 23,
    color: V2.text,
    maxWidth: 640,
  },

  recentSummary: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: V2.text,
  },

  recentLine: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: V2.textMuted,
  },

  activityLink: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    color: V2.accent,
  },

  attentionWarning: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    color: V2.warning,
  },

  decisionHeader: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },

  decisionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: V2.text,
  },

  decisionReason: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: V2.textMuted,
  },

  actions: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
