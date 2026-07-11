# Audit Checklist — BRAIN-003

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **BRAIN-003**
- Title · **Context Engine**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-08T07:42:33.385Z

## Platform audit gates

- [ ] TypeScript compiles clean (npx tsc --noEmit)
- [ ] Atlas health passes (npm run atlas:health)
- [ ] Atlas audit passes (npm run atlas:audit)
- [ ] Strict audit passes (npm run atlas:audit -- --strict)
- [ ] No blockers in audit report
- [ ] Release decision is APPROVED or APPROVED_WITH_NOTES
- [ ] No .env staged or committed
- [ ] No hardcoded API keys in source
- [ ] No Claude references outside provider layer
- [ ] No Doughbert logic in Atlas brain/core
- [ ] npm run atlas:brief still works (backward compatibility)
- [ ] npm run atlas:mission BRAIN-003 regenerates package

## Mission-specific checks

- [ ] Context Engine module exists under src/atlas/
- [ ] ContextEngine, ContextBuilder and ContextRegistry provider pipeline implemented per mission scope
- [ ] Context snapshot (relevantEntities, relevantKnowledge, relevantWorkflows, health) implemented per mission scope
- [ ] Decision Engine now pulls a context snapshot before every self-review verdict implemented per mission scope
- [ ] Entity and knowledge catalog depth (still thin — most snapshots score partial or empty) implemented per mission scope
- [ ] Constraint respected: Provider-independent Brain module
- [ ] Constraint respected: Context building must never block a decision (best-effort, same as memory)
- [ ] Constraint respected: No fabricated entities or knowledge — only what the real registries actually contain
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-003 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] The Decision Engine's reasoning references context health (empty/partial/healthy) and relevant known entities or knowledge when deciding what to prioritize next.

## Architecture rules

- [ ] ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- [ ] Generic architecture over vertical coupling
- [ ] Provider independence in Brain and core platform layers
- [ ] Atlas core blijft domein-onafhankelijk
- [ ] Registry pattern voor uitbreidbaarheid
- [ ] Geen vertical-specifieke logica in generieke modules
- [ ] TypeScript-first en strict compileerbaar
- [ ] Brain modules blijven provider-onafhankelijk
- [ ] Geen Claude- of Doughbert-logica in brain core

## Security standards

- [ ] Geen .env of API keys in source control
- [ ] Geen secrets in logs
- [ ] Provider credentials alleen via environment/config layer
