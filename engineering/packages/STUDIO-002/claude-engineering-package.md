# Execution Package — STUDIO-002

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (6/10)

- Mission STUDIO-002 is on the Constitution roadmap (CEO receives debrief and continue-or-adjust decision after every initiative).
- Mission focus advances autonomy capabilities.
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
- **Selected mission:** STUDIO-002
- **Recommended Next Initiative:** ATLAS-001

Mijn advies is om Orchestration te verbeteren.
Reden: Orchestration is volwassen volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Evolution Engine (ATLAS-001). Mission ID STUDIO-002 provided — evolution assessment confirms alignment. Roadmap context: CEO receives debrief and continue-or-adjust decision after every initiative Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected STUDIO-002 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 74%. Developing: Memory, Context, Planning. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Memory (40% gap), Context (40% gap), Planning (35% gap), Orchestration (10% gap), Studio (10% gap)
- **Highest value:** Orchestration

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 8 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 5 platform gap(s) identified
- **Recommended Evolution** (pass) — STUDIO-002 · Branch Director Debrief Flow
- **Mission Registry** (pass) — STUDIO-002 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
STUDIO-002
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

- **Mission ID:** STUDIO-002
- **Title:** Branch Director Debrief Flow
- **Registry source:** engineering/missions/STUDIO-002.mission
- **Template:** studio
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-07T17:53:17.902Z

## Goal

After every completed initiative, Atlas gives the CEO a clear debrief and asks for a continue-or-adjust decision — like a Branch Director reporting to the CEO.

## Implementation focus

- Branch Director Debrief after release completion
- Dutch CEO-facing debrief narrative
- Ja, ga door / Nee, aanpassen decision flow
- Continue to next initiative or propose adjustments
- No terminal-first or raw git language in CEO UI

## Constraints

- Internal technical terms may remain in services and audit layers
- CEO must explicitly choose continue or adjust
- Extend STUDIO-001 CEO Workflow — no breaking changes

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
- Studio gebruikt registries voor widgets, commands en panels
- UI panels blijven thin — geen businesslogica duplicatie

## Mission Dependencies (inferred)

- **ATLAS-003** · Branch Director Identity · _requires_ — Debrief uses Branch Director language
- **BRAIN-004** · Decision Engine · _requires_ — Next initiative recommendation comes from Decision Engine
- **STUDIO-001** · CEO Workflow · _requires_ — Debrief flow extends CEO Workflow in Studio

## Definition of Done

- [ ] Branch Director Debrief Flow module exists under src/atlas/
- [ ] Branch Director Debrief after release completion implemented per mission scope
- [ ] Dutch CEO-facing debrief narrative implemented per mission scope
- [ ] Ja, ga door / Nee, aanpassen decision flow implemented per mission scope
- [ ] Continue to next initiative or propose adjustments implemented per mission scope
- [ ] No terminal-first or raw git language in CEO UI implemented per mission scope
- [ ] Constraint respected: Internal technical terms may remain in services and audit layers
- [ ] Constraint respected: CEO must explicitly choose continue or adjust
- [ ] Constraint respected: Extend STUDIO-001 CEO Workflow — no breaking changes
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission STUDIO-002 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Mission completed successfully.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission STUDIO-002
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for STUDIO-002"
- npm run atlas:mission STUDIO-002

## Commands to run before finishing

```bash
npm run atlas:mission STUDIO-002
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

Mission completed successfully.

---

_Generated by Atlas Mission Orchestrator · 2026-07-07T17:53:17.902Z_
