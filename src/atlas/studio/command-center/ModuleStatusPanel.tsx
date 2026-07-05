import CommandCenterCard, { CommandCenterRow } from "./CommandCenterCard";
import type { CommandCenterModuleRow } from "./types";

type ModuleStatusPanelProps = {
  modules: CommandCenterModuleRow[];
};

export default function ModuleStatusPanel({ modules }: ModuleStatusPanelProps) {
  return (
    <CommandCenterCard title="Modules" subtitle="Active vertical and future module slots">
      {modules.map((module) => (
        <CommandCenterRow
          key={module.id}
          label={module.name}
          value={
            module.active
              ? `Active · v${module.version ?? "1.0.0"}`
              : module.status === "planned"
                ? "Future module placeholder"
                : "Registered"
          }
          status={module.active ? "healthy" : module.status}
        />
      ))}
    </CommandCenterCard>
  );
}
