# Execution Package — BRAIN-003

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (9/10)

- Mission BRAIN-003 is on the Constitution roadmap (Context awareness feeds planning and decisions).
- Mission focus advances autonomy capabilities.
- Mission strengthens Atlas platform execution infrastructure.
- Mission ID follows Atlas platform naming conventions.
- Evaluated against: Work advances the North Star when it reduces manual steps toward autonomous execution
- Evaluated against: Missions must map to at least one Capability and one System
- North Star: Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.

## Organizational Model

- **Atlas role:** Branch Director (Vestigingsdirecteur)
- **Organization model:** ATLAS-002
- **Departments:** Engineering, Quality Assurance, Operations
- **Workers assigned:** 4
- **Execution Package required:** Yes

Atlas (Branch Director) routes software work to Engineering department. Execution Package will be generated for Claude Engineer execution. ChatGPT defines architecture; Atlas operationalizes execution.

## Evolution Engine

- **Engine ID:** ATLAS-001
- **North Star aligned:** Yes (9/10)
- **Selected mission:** BRAIN-003
- **Recommended Next Initiative:** ATLAS-001

Mijn advies is om Orchestration te verbeteren.
Reden: Orchestration is volwassen volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Evolution Engine (ATLAS-001). Mission ID BRAIN-003 provided — evolution assessment confirms alignment. Roadmap context: Context awareness feeds planning and decisions Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected BRAIN-003 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 79%. Developing: Memory, Context, Planning. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Context (30% gap), Memory (25% gap), Planning (22% gap), Orchestration (10% gap)
- **Highest value:** Orchestration

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 8 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 4 platform gap(s) identified
- **Recommended Evolution** (pass) — BRAIN-003 · Context Engine
- **Mission Registry** (pass) — BRAIN-003 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
BRAIN-003
```

No additional instructions from ChatGPT are required or expected.

Humans may express intent (e.g. "better at reasoning"); Atlas maps intent to missions via the Constitution.

## Atlas inference pipeline

```
Constitution
↓
North Star
↓
Principles
↓
Capabilities
↓
Systems
↓
Roadmap
↓
Mission Registry
↓
Execution Packages
↓
Claude
↓
Branch Director Review
```

## Mission (from Registry)

- **Mission ID:** BRAIN-003
- **Title:** Context Engine
- **Registry source:** engineering/missions/BRAIN-003.mission
- **Template:** brain
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-08T07:42:33.385Z

## Goal

Give every Atlas decision a scored snapshot of what Atlas already knows (entities, knowledge, workflows) instead of reasoning from capability-gap numbers alone.

## Implementation focus

- ContextEngine, ContextBuilder and ContextRegistry provider pipeline
- Context snapshot (relevantEntities, relevantKnowledge, relevantWorkflows, health)
- Decision Engine now pulls a context snapshot before every self-review verdict
- Entity and knowledge catalog depth (still thin — most snapshots score partial or empty)

## Constraints

- Provider-independent Brain module
- Context building must never block a decision (best-effort, same as memory)
- No fabricated entities or knowledge — only what the real registries actually contain

## Engineering Standards (inferred)

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Deterministic, rule-based orchestration before AI generation
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star (inferred)

- Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- Atlas interprets natural-language intent and proposes the recommended next initiative
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Execution packages are generated without external brief writing
- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution

## Architecture Rules (inferred)

- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- Brain modules blijven provider-onafhankelijk
- Geen Claude- of Doughbert-logica in brain core

## Mission Dependencies (inferred)

- **BRAIN-001** · Planner Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-002** · Memory Engine · _requires_ — Prior BRAIN mission in sequence

## Definition of Done

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

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-003
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for BRAIN-003"
- npm run atlas:mission BRAIN-003

## Commands to run before finishing

```bash
npm run atlas:mission BRAIN-003
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Claude instructions

1. Implement this mission under `src/atlas/` using the focus areas above.
2. Follow all Engineering Standards, Architecture Rules, and Constraints.
3. Respect Mission Dependencies — do not rebuild upstream missions unless required.
4. Do **not** write a new Architecture Brief — Atlas already generated the engineering package.
5. Keep changes small, TypeScript strict, and registry-aligned.
6. Complete the Definition of Done checklist before marking the mission done.
7. Run validation commands and ensure Branch Director Release Decision is APPROVED or APPROVED_WITH_NOTES.
8. Fill in `release-notes.md` after implementation.

## Success criteria

The Decision Engine's reasoning references context health (empty/partial/healthy) and relevant known entities or knowledge when deciding what to prioritize next.

---

_Generated by Atlas Mission Orchestrator · 2026-07-08T07:42:33.385Z_
