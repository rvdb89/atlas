# Claude Engineering Package — ATLAS-002

> **Atlas Mission Orchestrator** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (9/10)

- Mission ATLAS-002 is on the Constitution roadmap (Atlas becomes Branch Director — routing intent to departments, not just code).
- Mission focus advances autonomy capabilities.
- Mission strengthens Atlas platform execution infrastructure.
- Mission ID follows Atlas platform naming conventions.
- Evaluated against: Work advances the North Star when it reduces manual steps toward autonomous execution
- Evaluated against: Missions must map to at least one Capability and one System
- North Star: Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Engineering Packages only when software work is required.

## Organizational Model

- **Atlas role:** Branch Director (Vestigingsdirecteur)
- **Organization model:** ATLAS-002
- **Departments:** Engineering, Quality Assurance, Operations
- **Workers assigned:** 4
- **Engineering Package required:** Yes

Atlas (Branch Director) routes software work to Engineering department. Engineering Package will be generated for Claude Engineer execution. ChatGPT defines architecture; Atlas operationalizes execution.

## Evolution Engine

- **Engine ID:** ATLAS-001
- **North Star aligned:** Yes (9/10)
- **Selected mission:** ATLAS-002
- **Next best mission:** ATLAS-001

Mission ID ATLAS-002 provided — evolution assessment confirms alignment. Roadmap context: Atlas becomes Branch Director — routing intent to departments, not just code Selected by evolution value score — not static roadmap priority.

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 61%. Developing: Memory, Context, Planning, Studio. Nascent: Reasoning. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Engineering Packages only when software work is required.
- **Gaps:** Reasoning (75% gap), Memory (40% gap), Context (40% gap), Planning (35% gap), Orchestration (10% gap)
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
- **Recommended Evolution** (pass) — ATLAS-002 · Organizational Model
- **Mission Registry** (pass) — ATLAS-002 registered
- **Engineering Package** (pass) — Ready to generate

## Input received

```
ATLAS-002
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

- **Mission ID:** ATLAS-002
- **Title:** Organizational Model
- **Registry source:** engineering/missions/ATLAS-002.mission
- **Template:** engineering
- **Atlas:** 0.21.0 (atlas-002)
- **Generated:** 2026-07-06T20:33:58.547Z

## Goal

Atlas is no longer an Engineering Manager. Atlas becomes the Branch Director (Vestigingsdirecteur) of the Robbert AI Organization — routing intent to AI departments and workers.

## Implementation focus

- Organizational Model under src/atlas/organization/
- Leadership hierarchy: Robbert → ChatGPT → Atlas → Departments → Workers
- Eight AI departments with worker assignments
- Intent routing: Capability → Department → Worker → Execution Plan
- Engineering Package only when software work is required
- Constitution updated with organizational identity

## Constraints

- ChatGPT defines architecture only — never manages workers
- Every AI Worker reports to Atlas
- TypeScript compiles clean
- Atlas Auditor approves

## Engineering Standards (inferred)

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Deterministic, rule-based orchestration before AI generation
- Atlas Auditor validates whether work advances the North Star
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star (inferred)

- Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Engineering Packages only when software work is required.
- Atlas interprets natural-language intent and proposes the next mission
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Engineering packages are generated without external brief writing
- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents

## Architecture Rules (inferred)

- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

## Mission Dependencies (inferred)

- **ATLAS-000** · Atlas Constitution · _requires_ — Organizational Model extends Constitution identity
- **ATLAS-001** · Evolution Engine · _requires_ — Evolution complements organizational routing

## Definition of Done

- [ ] Organizational Model module exists under src/atlas/
- [ ] Organizational Model under src/atlas/organization/ implemented per mission scope
- [ ] Leadership hierarchy: Robbert → ChatGPT → Atlas → Departments → Workers implemented per mission scope
- [ ] Eight AI departments with worker assignments implemented per mission scope
- [ ] Intent routing: Capability → Department → Worker → Execution Plan implemented per mission scope
- [ ] Engineering Package only when software work is required implemented per mission scope
- [ ] Constitution updated with organizational identity implemented per mission scope
- [ ] Constraint respected: ChatGPT defines architecture only — never manages workers
- [ ] Constraint respected: Every AI Worker reports to Atlas
- [ ] Constraint respected: TypeScript compiles clean
- [ ] Constraint respected: Atlas Auditor approves
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission ATLAS-002 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:organize -- "I want Atlas to improve my Instagram growth." routes to Marketing department with execution plan — no Engineering Package unless software is required.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission ATLAS-002
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:evolve -- "intent for ATLAS-002"
- npm run atlas:mission ATLAS-002

## Commands to run before finishing

```bash
npm run atlas:mission ATLAS-002
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

npm run atlas:organize -- "I want Atlas to improve my Instagram growth." routes to Marketing department with execution plan — no Engineering Package unless software is required.

---

_Generated by Atlas Mission Orchestrator · 2026-07-06T20:33:58.547Z_
