# Execution Package — ENG-006B

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (9/10)

- Mission ENG-006B is on the Constitution roadmap (Package becomes primary Claude artifact).
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
- **North Star aligned:** Yes (7/10)
- **Selected mission:** ENG-006B
- **Recommended Next Initiative:** ATLAS-001

Mijn advies is om Orchestration te verbeteren.
Reden: Orchestration is volwassen volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Evolution Engine (ATLAS-001). Mission ID ENG-006B provided — evolution assessment confirms alignment. Roadmap context: Package becomes primary Claude artifact Selected by evolution value score — not static roadmap priority. North Star alignment score: 7/10. Selected ENG-006B because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 85%. Developing: Memory, Context, Planning, Execution, Content. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Content (15% gap), Context (10% gap), Orchestration (10% gap), Memory (7% gap)
- **Highest value:** Orchestration

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 10 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 4 platform gap(s) identified
- **Recommended Evolution** (pass) — ENG-006B · Engineering Package Structure
- **Mission Registry** (pass) — ENG-006B registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
ENG-006B
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

- **Mission ID:** ENG-006B
- **Title:** Engineering Package Structure
- **Registry source:** engineering/missions/ENG-006B.mission
- **Template:** engineering
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-10T21:19:17.724Z

## Goal

Mission Orchestrator genereert een compleet Engineering Package vanuit alleen een Mission ID.

## Implementation focus

- Engineering Package folder
- Package manifest
- Claude entrypoint
- Architecture brief inference
- Validation plan
- Audit checklist
- Release notes stub

## Constraints

- Geen breaking changes
- npm run atlas:brief blijft werken
- ChatGPT schrijft nooit meer Architecture Briefs

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

- **ATLAS-000** · Atlas Constitution · _requires_ — Packages derive from Constitution
- **ENG-002** · Mission Brief Generator · _related_ — Brief generator remains backward compatible
- **ENG-006** · Mission Orchestrator · _extends_ — Extends mission orchestrator with package structure

## Definition of Done

- [ ] Engineering Package Structure module exists under src/atlas/
- [ ] Engineering Package folder implemented per mission scope
- [ ] Package manifest implemented per mission scope
- [ ] Claude entrypoint implemented per mission scope
- [ ] Architecture brief inference implemented per mission scope
- [ ] Validation plan implemented per mission scope
- [ ] Audit checklist implemented per mission scope
- [ ] Release notes stub implemented per mission scope
- [ ] Constraint respected: Geen breaking changes
- [ ] Constraint respected: npm run atlas:brief blijft werken
- [ ] Constraint respected: ChatGPT schrijft nooit meer Architecture Briefs
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission ENG-006B regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:mission BRAIN-004 levert het volledige Engineering Package zonder extra ChatGPT instructies.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission ENG-006B
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for ENG-006B"
- npm run atlas:mission ENG-006B

## Commands to run before finishing

```bash
npm run atlas:mission ENG-006B
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

npm run atlas:mission BRAIN-004 levert het volledige Engineering Package zonder extra ChatGPT instructies.

---

_Generated by Atlas Mission Orchestrator · 2026-07-10T21:19:17.724Z_
