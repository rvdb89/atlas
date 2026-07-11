# Execution Package — EXEC-001

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (8/10)

- Mission EXEC-001 is on the Constitution roadmap (Closes the loop from engineering package to real code — the missing link toward Atlas autonomously building a new app on command).
- Mission focus advances autonomy capabilities.
- Mission strengthens Atlas platform execution infrastructure.
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
- **Selected mission:** EXEC-001
- **Recommended Next Initiative:** ATLAS-001

Mijn advies is om Orchestration te verbeteren.
Reden: Orchestration is volwassen volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Evolution Engine (ATLAS-001). Mission ID EXEC-001 provided — evolution assessment confirms alignment. Roadmap context: Closes the loop from engineering package to real code — the missing link toward Atlas autonomously building a new app on command Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected EXEC-001 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 74%. Developing: Memory, Context, Planning, Execution. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Execution (50% gap), Context (30% gap), Memory (25% gap), Planning (22% gap), Orchestration (10% gap)
- **Highest value:** Orchestration

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 9 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 5 platform gap(s) identified
- **Recommended Evolution** (pass) — EXEC-001 · Execution Engine
- **Mission Registry** (pass) — EXEC-001 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
EXEC-001
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

- **Mission ID:** EXEC-001
- **Title:** Execution Engine
- **Registry source:** engineering/missions/EXEC-001.mission
- **Template:** engineering
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-08T10:20:35.891Z

## Goal

Close the loop from "Atlas generated an engineering package" to "there is real code" — the missing link toward Atlas autonomously building a new app on command.

## Implementation focus

- ExecutionEngine module (scripts/atlas/executionEngine.ts) and mission.implement AI task
- Claude drafts a small, focused code proposal from a mission's real architecture brief and validation plan
- Proposed files are written to a review-only proposed-changes/ folder — never the working tree
- Path safety allowlist/denylist so proposals can never touch package.json, .env, node_modules, or escape the repo
- Manual CLI trigger (npm run atlas:execute, entrypoint scripts/atlas-execute.ts) so a human always decides when code gets drafted
- Live repository context gathering, automatic diff application, test execution, and git automation (still missing)

## Constraints

- No automatic writes to the working tree or git — proposals only, human applies them
- No mock code generation — requires a real ANTHROPIC_API_KEY, fails honestly otherwise
- Every proposed file path validated against an allowlist before it touches disk
- Provider-independent through the existing AI Orchestrator — no Claude-specific coupling in the engine itself

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

_No upstream mission dependencies inferred._

## Definition of Done

- [ ] Execution Engine module exists under src/atlas/
- [ ] ExecutionEngine module (scripts/atlas/executionEngine.ts) and mission.implement AI task implemented per mission scope
- [ ] Claude drafts a small, focused code proposal from a mission's real architecture brief and validation plan implemented per mission scope
- [ ] Proposed files are written to a review-only proposed-changes/ folder — never the working tree implemented per mission scope
- [ ] Path safety allowlist/denylist so proposals can never touch package.json, .env, node_modules, or escape the repo implemented per mission scope
- [ ] Manual CLI trigger (npm run atlas:execute, entrypoint scripts/atlas-execute.ts) so a human always decides when code gets drafted implemented per mission scope
- [ ] Live repository context gathering, automatic diff application, test execution, and git automation (still missing) implemented per mission scope
- [ ] Constraint respected: No automatic writes to the working tree or git — proposals only, human applies them
- [ ] Constraint respected: No mock code generation — requires a real ANTHROPIC_API_KEY, fails honestly otherwise
- [ ] Constraint respected: Every proposed file path validated against an allowlist before it touches disk
- [ ] Constraint respected: Provider-independent through the existing AI Orchestrator — no Claude-specific coupling in the engine itself
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission EXEC-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Running npm run atlas:execute -- <MISSION-ID> for a registered mission produces a real, reviewable code proposal under engineering/packages/<MISSION-ID>/proposed-changes/ with a CHANGES.md summary, and nothing outside that folder changes.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission EXEC-001
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for EXEC-001"
- npm run atlas:mission EXEC-001

## Commands to run before finishing

```bash
npm run atlas:mission EXEC-001
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

Running npm run atlas:execute -- <MISSION-ID> for a registered mission produces a real, reviewable code proposal under engineering/packages/<MISSION-ID>/proposed-changes/ with a CHANGES.md summary, and nothing outside that folder changes.

---

_Generated by Atlas Mission Orchestrator · 2026-07-08T10:20:35.891Z_
