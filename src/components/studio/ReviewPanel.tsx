import { Pressable, StyleSheet, Text, View } from "react-native";

import { getValidationReport } from "@/ai/types";
import type { PublicationDraft } from "@/atlas/publishing/types";
import { EDITOR_IN_CHIEF, getTeamMember } from "@/studio/aiTeam";
import { studioService } from "@/studio/services/studioService";
import { STUDIO_COLORS } from "./studioTheme";

const proof = getTeamMember("fact-checker");
const doughbert = getTeamMember("domain-validator");

type ReviewPanelProps = {
  draft: PublicationDraft;
  onUpdated?: () => void;
};

export default function ReviewPanel({ draft, onUpdated }: ReviewPanelProps) {
  function handleApprove() {
    studioService.approve(draft.id, "Goedgekeurd door Editor-in-Chief");
    onUpdated?.();
  }

  function handleReject() {
    studioService.reject(draft.id, "Afgewezen — opnieuw laten genereren");
    onUpdated?.();
  }

  function handlePublish() {
    try {
      studioService.publish(draft.id);
      onUpdated?.();
    } catch {
      // Publish blocked until Proof + Doughbert pass
    }
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>
        {EDITOR_IN_CHIEF.emoji} {EDITOR_IN_CHIEF.name}
      </Text>
      <Text style={styles.subtitle}>{EDITOR_IN_CHIEF.description}</Text>

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.approve]} onPress={handleApprove}>
          <Text style={styles.buttonText}>Approve</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.reject]} onPress={handleReject}>
          <Text style={styles.buttonText}>Reject</Text>
        </Pressable>
      </View>

      {draft.reviewStatus === "approved" ? (
        <Pressable style={[styles.button, styles.publish]} onPress={handlePublish}>
          <Text style={styles.buttonText}>Publish</Text>
        </Pressable>
      ) : null}

      {getValidationReport(draft) && !getValidationReport(draft)!.passed ? (
        <Text style={styles.blocker}>
          {doughbert.emoji} {doughbert.name}: publicatie geblokkeerd tot validatiescore ≥ 75.
        </Text>
      ) : null}

      {draft.qualityReport && !draft.qualityReport.passed ? (
        <Text style={styles.blocker}>
          {proof.emoji} {proof.name}: redactionele quality score te laag.
        </Text>
      ) : null}

      <Text style={styles.status}>Status: {draft.reviewStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    gap: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.secondary,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  button: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  approve: {
    backgroundColor: STUDIO_COLORS.success,
  },

  reject: {
    backgroundColor: STUDIO_COLORS.danger,
  },

  publish: {
    backgroundColor: STUDIO_COLORS.accent,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "800",
    color: STUDIO_COLORS.warmWhite,
  },

  status: {
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
  },

  blocker: {
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.warning,
  },
});
