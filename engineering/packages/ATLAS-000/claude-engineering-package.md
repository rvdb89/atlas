# Claude Engineering Package — ATLAS-000

> **Atlas Mission Orchestrator** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (9/10)

- Mission ATLAS-000 is on the Constitution roadmap (Define why Atlas exists before deciding what to build).
- Mission focus advances autonomy capabilities.
- Mission strengthens Atlas platform execution infrastructure.
- Mission ID follows Atlas platform naming conventions.
- Evaluated against: Work advances the North Star when it reduces manual steps toward autonomous execution
- Evaluated against: Missions must map to at least one Capability and one System
- North Star: Atlas becomes an AI Operating System that translates human intent into autonomous execution — with less manual intervention per workflow and more trustworthy release decisions.

## Decision Framework

- **Framework ID:** ATLAS-001
- **North Star aligned:** Yes (9/10)
- **Selected mission:** ATLAS-000
- **Next best mission:** ATLAS-001

Intent "Execute registered mission ATLAS-000 per Atlas Decision Framework." maps to Reasoning, Orchestration capability. Systems impacted: Atlas Brain, Engineering Orchestrator. Roadmap priority P0 selects ATLAS-000 (Atlas Constitution). Rationale: Define why Atlas exists before deciding what to build

### Decision steps

- **Intent** (pass) — Intent recognized
- **North Star** (pass) — North Star alignment confirmed
- **Principles** (pass) — 4 applicable principle(s)
- **Capabilities** (pass) — 2 capability(ies) identified
- **Systems** (pass) — 2 system(s) impacted
- **Roadmap** (pass) — 1 mission(s) on roadmap
- **Mission Registry** (pass) — ATLAS-000 registered
- **Engineering Package** (pass) — Ready for Engineering Package generation

## Input received

```
ATLAS-000
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

- **Mission ID:** ATLAS-000
- **Title:** Atlas Constitution
- **Registry source:** engineering/missions/ATLAS-000.mission
- **Template:** engineering
- **Atlas:** 0.19.0 (atlas-001)
- **Generated:** 2026-07-06T20:11:19.079Z

## Goal

Atlas must understand WHY it exists before deciding WHAT to build. The Constitution becomes the highest source of truth — everything else derives from it.

## Implementation focus

- Constitution module under src/atlas/constitution/
- North Star, principles, capabilities, systems
- Roadmap and mission derivation rules
- Priority and North Star evaluation rules
- Intent resolver for human input
- MissionKnowledge derives from Constitution
- engineering/constitution/atlas-constitution.md artifact

## Constraints

- No Doughbert logic in Atlas core
- TypeScript compiles clean
- npm run atlas:brief and atlas:mission keep working
- Auditor approves after implementation

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

## Architecture Rules (inferred)

- ChatGPT must not define missions or write Architecture Briefs
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Registry pattern for extensibility across systems
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

## Mission Dependencies (inferred)

_No upstream mission dependencies inferred._

## Definition of Done

- [ ] Atlas Constitution module exists under src/atlas/
- [ ] Constitution module under src/atlas/constitution/ implemented per mission scope
- [ ] North Star, principles, capabilities, systems implemented per mission scope
- [ ] Roadmap and mission derivation rules implemented per mission scope
- [ ] Priority and North Star evaluation rules implemented per mission scope
- [ ] Intent resolver for human input implemented per mission scope
- [ ] MissionKnowledge derives from Constitution implemented per mission scope
- [ ] engineering/constitution/atlas-constitution.md artifact implemented per mission scope
- [ ] Constraint respected: No Doughbert logic in Atlas core
- [ ] Constraint respected: TypeScript compiles clean
- [ ] Constraint respected: npm run atlas:brief and atlas:mission keep working
- [ ] Constraint respected: Auditor approves after implementation
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission ATLAS-000 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Human input evolves from "Build a Decision Engine" to "I want Atlas to become better at reasoning" — Atlas determines the rest from the Constitution.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission ATLAS-000
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for ATLAS-000"
- npm run atlas:mission ATLAS-000

## Commands to run before finishing

```bash
npm run atlas:mission ATLAS-000
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

Human input evolves from "Build a Decision Engine" to "I want Atlas to become better at reasoning" — Atlas determines the rest from the Constitution.

---

_Generated by Atlas Mission Orchestrator · 2026-07-06T20:11:19.079Z_
