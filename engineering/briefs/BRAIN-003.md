# Architecture Brief — BRAIN-003

## Titel

# BRAIN-003 — Context Engine

## Mission Metadata

- Mission ID · **BRAIN-003**
- Title · **Context Engine**
- Template · Brain Mission
- Phase · PHASE 2 — ATLAS BRAIN
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-08T07:42:33.385Z

## Doel

Give every Atlas decision a scored snapshot of what Atlas already knows (entities, knowledge, workflows) instead of reasoning from capability-gap numbers alone.

## Scope

Atlas Brain capabilities: planning, memory, context, decision en agents.

### Focus
- ContextEngine, ContextBuilder and ContextRegistry provider pipeline
- Context snapshot (relevantEntities, relevantKnowledge, relevantWorkflows, health)
- Decision Engine now pulls a context snapshot before every self-review verdict
- Entity and knowledge catalog depth (still thin — most snapshots score partial or empty)

## Niet doen

- Provider-independent Brain module
- Context building must never block a decision (best-effort, same as memory)
- No fabricated entities or knowledge — only what the real registries actually contain
- Geen breaking changes
- Geen ongevraagde refactors
- Geen externe database zonder expliciete opdracht

## Architectuur

### Principes
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- Brain modules blijven provider-onafhankelijk
- Geen Claude- of Doughbert-logica in brain core

### Mission Architecture
- Implement ContextEngine, ContextBuilder and ContextRegistry provider pipeline using registry-based Atlas patterns.
- Implement Context snapshot (relevantEntities, relevantKnowledge, relevantWorkflows, health) using registry-based Atlas patterns.
- Implement Decision Engine now pulls a context snapshot before every self-review verdict using registry-based Atlas patterns.
- Implement Entity and knowledge catalog depth (still thin — most snapshots score partial or empty) using registry-based Atlas patterns.

## Technische eisen

- Clean TypeScript zonder placeholders
- Exports via index.ts barrels
- Bootstrap chain blijft intact
- Implement Context Engine under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver ContextEngine, ContextBuilder and ContextRegistry provider pipeline with rule-based local logic
- Deliver Context snapshot (relevantEntities, relevantKnowledge, relevantWorkflows, health) with rule-based local logic
- Deliver Decision Engine now pulls a context snapshot before every self-review verdict with rule-based local logic
- Deliver Entity and knowledge catalog depth (still thin — most snapshots score partial or empty) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution
- Mission BRAIN-003 advances Context Engine toward Atlas autonomy

## Definition of Done

- [ ] Context Engine module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] The Decision Engine's reasoning references context health (empty/partial/healthy) and relevant known entities or knowledge when deciding what to prioritize next.
- [ ] Constraint gerespecteerd: Provider-independent Brain module
- [ ] Constraint gerespecteerd: Context building must never block a decision (best-effort, same as memory)
- [ ] Constraint gerespecteerd: No fabricated entities or knowledge — only what the real registries actually contain

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert BRAIN-003.md
- npm run atlas:mission BRAIN-003 genereert engineering package
- Mission BRAIN-003 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/BRAIN-003.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor BRAIN-003 gebruiken
- Success criteria: The Decision Engine's reasoning references context health (empty/partial/healthy) and relevant known entities or knowledge when deciding what to prioritize next.

---

_Generated by Atlas Mission Brief Generator · 2026-07-08T07:42:33.385Z_
