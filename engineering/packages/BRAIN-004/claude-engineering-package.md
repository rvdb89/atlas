# Claude Engineering Package — BRAIN-004

> **Atlas Mission Orchestrator** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (9/10)

- Mission BRAIN-004 is on the Constitution roadmap (Reasoning and decision policies advance autonomy).
- Mission focus advances autonomy capabilities.
- Mission strengthens Atlas platform execution infrastructure.
- Mission ID follows Atlas platform naming conventions.
- Evaluated against: Work advances the North Star when it reduces manual steps toward autonomous execution
- Evaluated against: Missions must map to at least one Capability and one System
- North Star: Atlas becomes an AI Operating System that translates human intent into autonomous execution — with less manual intervention per workflow and more trustworthy release decisions.

## Evolution Engine

- **Engine ID:** ATLAS-001
- **North Star aligned:** Yes (9/10)
- **Selected mission:** BRAIN-004
- **Next best mission:** BRAIN-002

Mission ID BRAIN-004 provided — evolution assessment confirms alignment. Roadmap context: Reasoning and decision policies advance autonomy Selected by evolution value score — not static roadmap priority.

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
- **Recommended Evolution** (pass) — BRAIN-004 · Decision Engine (score 10.00)
- **Mission Registry** (pass) — BRAIN-004 registered
- **Engineering Package** (pass) — Ready to generate

## Input received

```
BRAIN-004
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

- **Mission ID:** BRAIN-004
- **Title:** Decision Engine
- **Registry source:** engineering/missions/BRAIN-004.mission
- **Template:** brain
- **Atlas:** 0.20.0 (atlas-001-evolution)
- **Generated:** 2026-07-06T20:24:45.623Z

## Goal

Atlas leert beslissingen nemen.

## Implementation focus

- Decision Engine
- Decision Policies
- Decision Registry

## Constraints

- Geen breaking changes

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

- **ATLAS-000** · Atlas Constitution · _requires_ — Constitution is the highest source of truth
- **BRAIN-001** · Planner Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-002** · Memory Engine · _requires_ — Memory engine supplies decision history
- **BRAIN-003** · Context Engine · _requires_ — Context engine informs decision inputs

## Definition of Done

- [ ] Decision Engine module exists under src/atlas/
- [ ] Decision Engine implemented per mission scope
- [ ] Decision Policies implemented per mission scope
- [ ] Decision Registry implemented per mission scope
- [ ] Constraint respected: Geen breaking changes
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-004 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Decision Engine volledig operationeel.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-004
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:evolve -- "intent for BRAIN-004"
- npm run atlas:mission BRAIN-004

## Commands to run before finishing

```bash
npm run atlas:mission BRAIN-004
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

Decision Engine volledig operationeel.

---

_Generated by Atlas Mission Orchestrator · 2026-07-06T20:24:45.623Z_
