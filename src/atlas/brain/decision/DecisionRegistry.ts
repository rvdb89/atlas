import type { DecisionPolicy } from "./decision.types";

const policies = new Map<string, DecisionPolicy>();

export function registerDecisionPolicy(policy: DecisionPolicy): void {
  policies.set(policy.id, policy);
}

export function getDecisionPolicy(id: string): DecisionPolicy | undefined {
  return policies.get(id);
}

export function listDecisionPolicies(): DecisionPolicy[] {
  return [...policies.values()].sort((left, right) => left.id.localeCompare(right.id));
}

export function registerDefaultDecisionPolicies(): void {
  if (policies.size > 0) return;

  registerDecisionPolicy({
    id: "constitution-first",
    label: "Constitution First",
    rule: "Constitution is the highest source of truth for every decision.",
    evaluate: (result) => ({
      status: "pass",
      note: `Decision grounded in ${result.inputs.constitutionId}.`,
    }),
  });

  registerDecisionPolicy({
    id: "human-intent-only",
    label: "Human Intent Only",
    rule: "Humans provide intent — Atlas derives initiatives and packages.",
    evaluate: (result) =>
      result.intent.trim()
        ? { status: "pass", note: "Intent supplied; Atlas derived the initiative." }
        : { status: "warn", note: "No intent — decision incomplete." },
  });

  registerDecisionPolicy({
    id: "explain-why",
    label: "Explain Why",
    rule: "Every decision must explain WHY it was made.",
    evaluate: (result) =>
      result.why.trim()
        ? { status: "pass", note: "Decision narrative produced." }
        : { status: "warn", note: "Missing decision narrative." },
  });

  registerDecisionPolicy({
    id: "organization-before-package",
    label: "Organization Before Package",
    rule: "Intent routes through Organization before engineering package generation.",
    evaluate: (result) => {
      if (!result.executionPackageRequired) {
        return {
          status: "pass",
          note: "Operational routing — no Execution Package required.",
        };
      }

      return result.departmentAssignments.length > 0
        ? { status: "pass", note: "Departments assigned before package trigger." }
        : { status: "warn", note: "Engineering path without department assignment." };
    },
  });

  registerDecisionPolicy({
    id: "evolution-value-score",
    label: "Evolution Value Score",
    rule: "Recommended initiatives close capability gaps by value score — not blind roadmap order.",
    evaluate: (result) => {
      if (!result.recommendedInitiativeId) {
        return { status: "warn", note: "No initiative selected." };
      }

      return {
        status: "pass",
        note: `${result.recommendedInitiativeId} selected at priority ${result.priorityScore.toFixed(2)}.`,
      };
    },
  });
}
