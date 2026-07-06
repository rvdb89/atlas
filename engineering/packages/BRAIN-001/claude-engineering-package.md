# Claude Engineering Package — BRAIN-001

> **Atlas Mission Orchestrator** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (9/10)

- Mission BRAIN-001 is on the Constitution roadmap (Planning capability enables goal decomposition and execution queues).
- Mission focus advances autonomy capabilities.
- Mission strengthens Atlas platform execution infrastructure.
- Mission ID follows Atlas platform naming conventions.
- Evaluated against: Work advances the North Star when it reduces manual steps toward autonomous execution
- Evaluated against: Missions must map to at least one Capability and one System
- North Star: Atlas becomes an AI Operating System that translates human intent into autonomous execution — with less manual intervention per workflow and more trustworthy release decisions.

## Evolution Engine

- **Engine ID:** ATLAS-001
- **North Star aligned:** Yes (9/10)
- **Selected mission:** BRAIN-001
- **Next best mission:** ATLAS-001

Mission ID BRAIN-001 provided — evolution assessment confirms alignment. Roadmap context: Planning capability enables goal decomposition and execution queues Selected by evolution value score — not static roadmap priority.

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 61%. Developing: Memory, Context, Planning, Studio. Nascent: Reasoning. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes an AI Operating System that translates human intent into autonomous execution — with less manual intervention per workflow and more trustworthy release decisions.
- **Gaps:** Reasoning (75% gap), Memory (40% gap), Context (40% gap), Planning (35% gap), Orchestration (10% gap)
- **Highest value:** Orchestration

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Current State** (pass) — 8 capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 6 gap(s) identified
- **Recommended Evolution** (pass) — BRAIN-001 · Planner Engine (score 10.00)
- **Mission Registry** (pass) — BRAIN-001 registered
- **Engineering Package** (pass) — Ready to generate

## Input received

```
BRAIN-001
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
Engineering Packages
↓
Claude
↓
Atlas Auditor
```

## Mission (from Registry)

- **Mission ID:** BRAIN-001
- **Title:** Planner Engine
- **Registry source:** engineering/missions/BRAIN-001.mission
- **Template:** brain
- **Atlas:** 0.20.0 (atlas-001-evolution)
- **Generated:** 2026-07-06T20:24:58.311Z

## Goal

Extend Atlas Brain planning capability for goal decomposition and execution queues.

## Implementation focus

- Planner registry and engine hardening
- Planning capability in Decision Framework roadmap
- Command Center planner visibility
- Integration with context and memory layers

## Constraints

- Provider-independent Brain module
- No Doughbert logic in generic planner core
- Registry pattern for planner extensions

## Engineering Standards (inferred)

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT must not define missions or write Architecture Briefs
- Deterministic, rule-based orchestration before AI generation
- Small focused changes with TypeScript strictness
- Atlas Auditor validates whether work advances the North Star
- Release decisions follow blockers — warnings inform, never block alone
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star (inferred)

- Atlas becomes an AI Operating System that translates human intent into autonomous execution — with less manual intervention per workflow and more trustworthy release decisions.
- Atlas interprets natural-language intent and proposes the next mission
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Engineering packages are generated without external brief writing
- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution

## Architecture Rules (inferred)

- ChatGPT must not define missions or write Architecture Briefs
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Registry pattern for extensibility across systems
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- Brain modules blijven provider-onafhankelijk
- Geen Claude- of Doughbert-logica in brain core

## Mission Dependencies (inferred)

- **ATLAS-000** · Atlas Constitution · _requires_ — Constitution defines planning capability
- **ATLAS-001** · Evolution Engine · _requires_ — Planning missions pass through Evolution Engine

## Definition of Done

- [ ] Planner Engine module exists under src/atlas/
- [ ] Planner registry and engine hardening implemented per mission scope
- [ ] Planning capability in Decision Framework roadmap implemented per mission scope
- [ ] Command Center planner visibility implemented per mission scope
- [ ] Integration with context and memory layers implemented per mission scope
- [ ] Constraint respected: Provider-independent Brain module
- [ ] Constraint respected: No Doughbert logic in generic planner core
- [ ] Constraint respected: Registry pattern for planner extensions
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:decide -- "I want Atlas to become better at planning." recommends BRAIN-001 and generates Engineering Package.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-001
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:evolve -- "intent for BRAIN-001"
- npm run atlas:mission BRAIN-001

## Commands to run before finishing

```bash
npm run atlas:mission BRAIN-001
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
7. Run validation commands and ensure Atlas Auditor release decision is APPROVED or APPROVED_WITH_NOTES.
8. Fill in `release-notes.md` after implementation.

## Success criteria

npm run atlas:decide -- "I want Atlas to become better at planning." recommends BRAIN-001 and generates Engineering Package.

---

_Generated by Atlas Mission Orchestrator · 2026-07-06T20:24:58.311Z_
