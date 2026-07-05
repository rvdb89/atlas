import CommandCenterCard, { CommandCenterRow } from "./CommandCenterCard";
import type { CommandCenterProviderRow } from "./types";

type ProviderStatusPanelProps = {
  providers: CommandCenterProviderRow[];
};

export default function ProviderStatusPanel({ providers }: ProviderStatusPanelProps) {
  return (
    <CommandCenterCard title="Provider Status" subtitle="Live intelligence layer · mock transport active">
      {providers.map((provider) => (
        <CommandCenterRow
          key={provider.id}
          label={provider.label}
          value={`${provider.configuration}${provider.latencyMs ? ` · ${provider.latencyMs}ms` : ""}`}
          status={provider.status}
        />
      ))}
    </CommandCenterCard>
  );
}
