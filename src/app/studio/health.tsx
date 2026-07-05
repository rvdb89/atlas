import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { refreshLiveProviderHealth } from "@/atlas/ai/providers/ProviderRegistry";
import { getAtlasHealthSnapshot } from "@/atlas/diagnostics";
import type { LiveProviderHealthInfo } from "@/atlas/diagnostics/types";
import {
  StudioCard,
  StudioScreen,
  StudioSectionTitle,
  StudioStatGrid,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { useStudioBootstrap } from "@/atlas/studio/hooks";
import { StudioHealthCard, StudioProviderHealthCard } from "@/atlas/studio/health";

export default function StudioHealthScreen() {
  useStudioBootstrap();
  const snapshot = useMemo(() => getAtlasHealthSnapshot(), []);
  const [liveProviders, setLiveProviders] = useState<LiveProviderHealthInfo[]>(snapshot.liveProviders);

  useEffect(() => {
    refreshLiveProviderHealth().then((providers) => {
      setLiveProviders(
        providers.map((provider) => ({
          id: provider.id,
          label: provider.label,
          available: provider.available,
          latencyMs: provider.latencyMs,
          message: provider.message,
          transportMode: provider.transportMode,
          hasApiKey: provider.hasApiKey,
          modelCount: provider.modelCount,
          models: provider.models,
          capabilities: {
            textGeneration: provider.capabilities.textGeneration,
            structuredOutput: provider.capabilities.structuredOutput,
            imageGeneration: provider.capabilities.imageGeneration,
            streaming: provider.capabilities.streaming,
          },
        })),
      );
    });
  }, []);

  const healthyCount = snapshot.subsystems.filter((item) => item.status === "healthy").length;
  const issueCount = snapshot.startupIssues.length;
  const healthyProviders = liveProviders.filter((provider) => provider.available).length;

  return (
    <StudioScreen
      title="Atlas Health"
      subtitle="Platform diagnostics for Studio, engines, registries, providers, and developer tooling."
    >
      <StudioStatGrid
        items={[
          { label: "Atlas Version", value: snapshot.atlasVersion },
          { label: "Build", value: snapshot.atlasBuild },
          { label: "Environment", value: snapshot.environment },
          { label: "Healthy", value: `${healthyCount}/${snapshot.subsystems.length}` },
        ]}
      />

      <StudioSectionTitle>CLI health checks</StudioSectionTitle>
      <StudioCard>
        {snapshot.checks.map((check) => (
          <View key={check.label} style={styles.checkRow}>
            <Text style={[styles.checkIcon, check.ok ? styles.checkOk : styles.checkFail]}>
              {check.ok ? "✔" : "✖"}
            </Text>
            <View style={styles.checkCopy}>
              <Text style={styles.checkLabel}>{check.label}</Text>
              {check.detail ? <Text style={styles.checkDetail}>{check.detail}</Text> : null}
            </View>
          </View>
        ))}
      </StudioCard>

      <StudioSectionTitle>{`AI Providers · ${healthyProviders}/${liveProviders.length}`}</StudioSectionTitle>
      {liveProviders.map((provider) => (
        <StudioProviderHealthCard key={provider.id} provider={provider} />
      ))}

      {issueCount > 0 ? (
        <>
          <StudioSectionTitle>{`${issueCount} startup issues`}</StudioSectionTitle>
          <StudioCard>
            {snapshot.startupIssues.map((issue) => (
              <Text key={`${issue.code}-${issue.message}`} style={styles.issue}>
                {issue.severity.toUpperCase()} · {issue.message}
              </Text>
            ))}
          </StudioCard>
        </>
      ) : null}

      <StudioSectionTitle>Subsystems</StudioSectionTitle>
      {snapshot.subsystems.map((subsystem) => (
        <StudioHealthCard key={subsystem.id} subsystem={subsystem} />
      ))}
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  checkIcon: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 1,
  },

  checkOk: {
    color: STUDIO_COLORS.success,
  },

  checkFail: {
    color: STUDIO_COLORS.danger,
  },

  checkCopy: {
    flex: 1,
  },

  checkLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  checkDetail: {
    marginTop: 2,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  issue: {
    fontSize: 13,
    lineHeight: 20,
    color: STUDIO_COLORS.danger,
    marginBottom: 8,
  },
});
