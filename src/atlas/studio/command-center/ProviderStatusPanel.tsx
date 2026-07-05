import CommandCenterCard, { CommandCenterRow } from "./CommandCenterCard";
import type { CommandCenterProviderRow } from "./types";

type ProviderStatusPanelProps = {
  providers: CommandCenterProviderRow[];
};

export default function ProviderStatusPanel({ providers }: ProviderStatusPanelProps) {
  const claude = providers.find((provider) => provider.id === "claude");

  return (
    <>
      {claude ? (
        <CommandCenterCard
          title="Claude Provider"
          subtitle="Live intelligence provider #1"
          status={claude.status}
        >
          <CommandCenterRow
            label="Configured"
            value={claude.configured ? "true" : "false"}
            status={claude.configured ? "healthy" : "mock"}
          />
          <CommandCenterRow
            label="Health"
            value={claude.health ?? "unknown"}
            status={claude.health === "healthy" ? "healthy" : claude.health === "error" ? "warning" : "mock"}
          />
          <CommandCenterRow label="Mode" value={claude.mode ?? "mock"} />
          {claude.latencyMs !== undefined ? (
            <CommandCenterRow label="Latency" value={`${claude.latencyMs}ms`} />
          ) : null}
          {claude.lastTask ? <CommandCenterRow label="Last task" value={claude.lastTask} /> : null}
        </CommandCenterCard>
      ) : null}

      <CommandCenterCard title="Provider Status" subtitle="Live intelligence layer">
        {providers.map((provider) => (
          <CommandCenterRow
            key={provider.id}
            label={provider.label}
            value={`${provider.configuration}${provider.latencyMs ? ` · ${provider.latencyMs}ms` : ""}`}
            status={provider.status}
          />
        ))}
      </CommandCenterCard>
    </>
  );
}
