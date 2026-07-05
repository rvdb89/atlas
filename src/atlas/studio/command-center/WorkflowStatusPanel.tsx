import CommandCenterCard, { CommandCenterRow } from "./CommandCenterCard";
import type { CommandCenterWorkflowRow } from "./types";

type WorkflowStatusPanelProps = {
  workflows: CommandCenterWorkflowRow[];
};

export default function WorkflowStatusPanel({ workflows }: WorkflowStatusPanelProps) {
  return (
    <CommandCenterCard title="Workflow Status" subtitle="Registered and planned Atlas workflows">
      {workflows.map((workflow) => (
        <CommandCenterRow
          key={workflow.id}
          label={workflow.label}
          value={workflow.detail ?? workflow.status}
          status={workflow.status}
        />
      ))}
    </CommandCenterCard>
  );
}
