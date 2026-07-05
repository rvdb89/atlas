import type {
  ContextBundle,
  ContextEntityRef,
  ContextKnowledgeRef,
  ContextMemoryRef,
  ContextProviderRef,
  ContextScoreInput,
  ContextWorkflowRef,
} from "./context.types";

function normalize(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(/[\s,.;:/_-]+/)
    .filter((token) => token.length > 1);
}

function includesAny(haystack: string, needles: string[]): boolean {
  const normalizedHaystack = normalize(haystack);
  return needles.some((needle) => normalizedHaystack.includes(needle));
}

export function scoreContextItem(input: ContextScoreInput): number {
  const goalTokens = tokenize(input.goal);
  const topicTokens = tokenize(input.topic ?? "");
  const searchTokens = [...goalTokens, ...topicTokens];
  const text = normalize(input.text ?? "");
  const tags = (input.tags ?? []).map(normalize);

  let score = input.importance ?? 1;

  if (searchTokens.length === 0) return score;

  for (const token of searchTokens) {
    if (text.includes(token)) score += 4;
    if (tags.some((tag) => tag.includes(token) || token.includes(tag))) score += 5;
  }

  if (topicTokens.length > 0 && includesAny(text, topicTokens)) {
    score += 6;
  }

  return score;
}

function sortByScore<T extends { score: number }>(items: T[]): T[] {
  return [...items].sort((left, right) => right.score - left.score);
}

export function resolveRelevantMemories(
  bundle: Pick<ContextBundle, "goal" | "memories">,
  topic?: string,
  minScore = 3,
): ContextMemoryRef[] {
  return sortByScore(
    bundle.memories
      .map((memory) => ({
        ...memory,
        score: scoreContextItem({
          goal: bundle.goal,
          topic,
          text: `${memory.title} ${memory.type}`,
          importance: memory.score,
        }),
      }))
      .filter((memory) => memory.score >= minScore),
  );
}

export function resolveRelevantEntities(
  bundle: Pick<ContextBundle, "goal" | "entities">,
  topic?: string,
  minScore = 2,
): ContextEntityRef[] {
  return sortByScore(
    bundle.entities
      .map((entity) => ({
        ...entity,
        score: scoreContextItem({
          goal: bundle.goal,
          topic,
          text: entity.label,
          importance: entity.score,
        }),
      }))
      .filter((entity) => entity.score >= minScore),
  );
}

export function resolveRelevantKnowledge(
  bundle: Pick<ContextBundle, "goal" | "knowledge">,
  topic?: string,
  minScore = 2,
): ContextKnowledgeRef[] {
  return sortByScore(
    bundle.knowledge
      .map((item) => ({
        ...item,
        score: scoreContextItem({
          goal: bundle.goal,
          topic,
          text: `${item.label} ${item.source}`,
          importance: item.score,
        }),
      }))
      .filter((item) => item.score >= minScore),
  );
}

export function resolveRelevantWorkflows(
  bundle: Pick<ContextBundle, "goal" | "workflows">,
  topic?: string,
  minScore = 1,
): ContextWorkflowRef[] {
  return sortByScore(
    bundle.workflows
      .map((workflow) => ({
        ...workflow,
        score: scoreContextItem({
          goal: bundle.goal,
          topic,
          text: workflow.label,
          importance: workflow.score,
        }),
      }))
      .filter((workflow) => workflow.score >= minScore),
  );
}

export function resolveRelevantProviders(
  bundle: Pick<ContextBundle, "goal" | "providers" | "plannerOutput">,
  minScore = 1,
): ContextProviderRef[] {
  const required = new Set(bundle.plannerOutput?.requiredProviders ?? []);

  return sortByScore(
    bundle.providers
      .map((provider) => {
        let score = provider.score;
        if (required.has(provider.id)) score += 8;
        score = scoreContextItem({
          goal: bundle.goal,
          text: provider.label,
          importance: score,
        });
        return { ...provider, score };
      })
      .filter((provider) => provider.score >= minScore),
  );
}

export function resolveContext(bundle: ContextBundle, topic?: string): ContextBundle {
  return {
    ...bundle,
    memories: resolveRelevantMemories(bundle, topic),
    entities: resolveRelevantEntities(bundle, topic),
    knowledge: resolveRelevantKnowledge(bundle, topic),
    workflows: resolveRelevantWorkflows(bundle, topic),
    providers: resolveRelevantProviders(bundle),
  };
}
