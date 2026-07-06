# Claude Engineering Package — ATLAS-001

> **Atlas Mission Orchestrator** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (9/10)

- Mission ATLAS-001 is on the Constitution roadmap (Teach Atlas how to evolve itself by comparing current state to North Star gaps).
- Mission focus advances autonomy capabilities.
- Mission strengthens Atlas platform execution infrastructure.
- Mission ID follows Atlas platform naming conventions.
- Evaluated against: Work advances the North Star when it reduces manual steps toward autonomous execution
- Evaluated against: Missions must map to at least one Capability and one System
- North Star: Atlas becomes an AI Operating System that translates human intent into autonomous execution — with less manual intervention per workflow and more trustworthy release decisions.

## Evolution Engine

- **Engine ID:** ATLAS-001
- **North Star aligned:** Yes (9/10)
- **Selected mission:** ATLAS-001
- **Next best mission:** BRAIN-004

Mission ID ATLAS-001 provided — evolution assessment confirms alignment. Roadmap context: Teach Atlas how to evolve itself by comparing current state to North Star gaps Selected by evolution value score — not static roadmap priority.

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
- **Recommended Evolution** (pass) — ATLAS-001 · Evolution Engine (score 10.00)
- **Mission Registry** (pass) — ATLAS-001 registered
- **Engineering Package** (pass) — Ready to generate

## Input received

```
ATLAS-001
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

- **Mission ID:** ATLAS-001
- **Title:** Evolution Engine
- **Registry source:** engineering/missions/ATLAS-001.mission
- **Template:** engineering
- **Atlas:** 0.20.0 (atlas-001-evolution)
- **Generated:** 2026-07-06T20:24:45.813Z

## Goal

Teach Atlas how to evolve itself. Atlas continuously compares Current State against the North Star, identifies capability gaps, and recommends evolution by value — not blind roadmap order.

## Implementation focus

- Evolution Engine module under src/atlas/constitution/
- Current State Registry with capability maturity
- Gap analysis and value-scored evolution recommendations
- Evolution answers: where we are, where we want to be, why next step
- Wire into Mission Orchestrator before package generation
- npm run atlas:evolve CLI

## Constraints

- Derives from ATLAS-000 Constitution
- No Doughbert logic in Atlas core
- TypeScript compiles clean
- Humans provide intent only — no Architecture Briefs

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

- **ATLAS-000** · Atlas Constitution · _requires_ — Evolution Engine derives from Constitution

## Definition of Done

- [ ] Evolution Engine module exists under src/atlas/
- [ ] Evolution Engine module under src/atlas/constitution/ implemented per mission scope
- [ ] Current State Registry with capability maturity implemented per mission scope
- [ ] Gap analysis and value-scored evolution recommendations implemented per mission scope
- [ ] Evolution answers: where we are, where we want to be, why next step implemented per mission scope
- [ ] Wire into Mission Orchestrator before package generation implemented per mission scope
- [ ] npm run atlas:evolve CLI implemented per mission scope
- [ ] Constraint respected: Derives from ATLAS-000 Constitution
- [ ] Constraint respected: No Doughbert logic in Atlas core
- [ ] Constraint respected: TypeScript compiles clean
- [ ] Constraint respected: Humans provide intent only — no Architecture Briefs
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission ATLAS-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:evolve -- "I want Atlas to become better at planning." determines everything else and generates Engineering Package.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission ATLAS-001
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:evolve -- "intent for ATLAS-001"
- npm run atlas:mission ATLAS-001

## Commands to run before finishing

```bash
npm run atlas:mission ATLAS-001
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

npm run atlas:evolve -- "I want Atlas to become better at planning." determines everything else and generates Engineering Package.

---

_Generated by Atlas Mission Orchestrator · 2026-07-06T20:24:45.813Z_
