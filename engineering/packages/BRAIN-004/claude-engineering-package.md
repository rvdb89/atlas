# Execution Package — BRAIN-004

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

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
- **Selected mission:** BRAIN-004
- **Recommended Next Initiative:** ATLAS-001

Mission ID BRAIN-004 provided — evolution assessment confirms alignment. Roadmap context: Reasoning and decision policies advance autonomy Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected BRAIN-004 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 69%. Developing: Memory, Context, Planning, Studio. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Memory (40% gap), Context (40% gap), Planning (35% gap), Orchestration (10% gap), Reasoning (5% gap)
- **Highest value:** Orchestration

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 8 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 6 platform gap(s) identified
- **Recommended Evolution** (pass) — BRAIN-004 · Decision Engine
- **Mission Registry** (pass) — BRAIN-004 registered
- **Execution Package** (pass) — Ready to generate

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
Execution Packages
↓
Claude
↓
Branch Director Review
```

## Mission (from Registry)

- **Mission ID:** BRAIN-004
- **Title:** Decision Engine
- **Registry source:** engineering/missions/BRAIN-004.mission
- **Template:** brain
- **Atlas:** 0.23.0 (brain-004)
- **Generated:** 2026-07-06T21:13:13.454Z

## Goal

Build the first reasoning engine of Atlas — transforming human intent into autonomous decisions with explicit WHY.

## Implementation focus

- Decision Engine composing Constitution, capabilities, Organization, and Roadmap
- Decision Policies and Decision Registry
- Reasoning layer explaining every recommended initiative
- Execution Package trigger when engineering is required

## Constraints

- No breaking changes to Evolution Engine or Organizational Model APIs
- Provider-independent Brain module under src/atlas/brain/decision/
- Every future initiative originates from the Decision Engine

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

- **ATLAS-000** · Atlas Constitution · _requires_ — Constitution is the highest source of truth
- **BRAIN-001** · Planner Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-002** · Memory Engine · _requires_ — Memory engine supplies decision history
- **BRAIN-003** · Context Engine · _requires_ — Context engine informs decision inputs

## Definition of Done

- [ ] Decision Engine module exists under src/atlas/
- [ ] Decision Engine composing Constitution, capabilities, Organization, and Roadmap implemented per mission scope
- [ ] Decision Policies and Decision Registry implemented per mission scope
- [ ] Reasoning layer explaining every recommended initiative implemented per mission scope
- [ ] Execution Package trigger when engineering is required implemented per mission scope
- [ ] Constraint respected: No breaking changes to Evolution Engine or Organizational Model APIs
- [ ] Constraint respected: Provider-independent Brain module under src/atlas/brain/decision/
- [ ] Constraint respected: Every future initiative originates from the Decision Engine
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-004 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:decide -- "I want Atlas to improve decision making." recommends BRAIN-004 and explains WHY.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-004
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for BRAIN-004"
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
7. Run validation commands and ensure Branch Director Release Decision is APPROVED or APPROVED_WITH_NOTES.
8. Fill in `release-notes.md` after implementation.

## Success criteria

npm run atlas:decide -- "I want Atlas to improve decision making." recommends BRAIN-004 and explains WHY.

---

_Generated by Atlas Mission Orchestrator · 2026-07-06T21:13:13.454Z_
