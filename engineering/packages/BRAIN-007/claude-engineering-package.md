# Execution Package — BRAIN-007

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (6/10)

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
- **Selected mission:** BRAIN-007
- **Recommended Next Initiative:** ATLAS-001

Mijn advies is om Orchestration te verbeteren.
Reden: Orchestration is volwassen volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Evolution Engine (ATLAS-001). Mission ID BRAIN-007 provided — evolution assessment confirms alignment. Selected by evolution value score — not static roadmap priority. North Star alignment score: 7/10. Selected BRAIN-007 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

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
- **Recommended Evolution** (pass) — BRAIN-007 · BRAIN-007
- **Mission Registry** (pass) — BRAIN-007 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
BRAIN-007
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

- **Mission ID:** BRAIN-007
- **Title:** Kennis-catalogus in Context Engine verbreden
- **Registry source:** engineering/missions/BRAIN-007.mission
- **Template:** brain
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-10T21:25:22.986Z

## Goal

ContextBuilder.ts's collectKnowledgeContext() injecteerde tot nu toe 3 hardgecodeerde placeholder-ids ("entity-catalog", "intelligence-insights", "publishing-templates", zonder echte inhoud) in élke context-snapshot, ongeacht het onderwerp. Deze mission vervangt dat door de echte, gepubliceerde artikel-catalogus.

## Implementation focus

- src/atlas/brain/context/ContextBuilder.ts (collectKnowledgeContext() — haalt nu de echte catalogus op via tryGetActiveModule().getArticleCatalog(), filtert stub-only artikelen eruit, rangschikt op onderwerp-relevantie)
- src/atlas/publishing/plugin/registry.ts (tryGetActiveModule — bestaande, module-onafhankelijke abstractie, al gebruikt door studioService.ts)
- src/modules/doughbert/plugin.ts (getArticleCatalog() — bestaande implementatie, ongewijzigd)
- src/atlas/brain/context/ContextSnapshot.ts (deriveContextHealth() gelezen ter verificatie — kennis bleek geen onderdeel van de health-berekening te zijn; alleen de documentatie hierover was onjuist, niet de code)

## Constraints

- Geen directe import van doughbert-specifieke bestanden in de Context Engine — alleen via de bestaande module-abstractie (tryGetActiveModule), zodat de Context Engine module-onafhankelijk blijft
- Alleen artikelen met echte inhoud (samenvatting of minstens één sectie) worden meegenomen — nooit een titel-only stub, zelfde regel als hasRealKnowledgeContent elders in de codebase
- TypeScript blijft compileren zonder nieuwe errors

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
- **BRAIN-003** · Context Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-004** · Decision Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-005** · Capability Registry & Roadmap Intelligence · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-006** · Geheugen delen tussen backend en dashboard · _requires_ — Prior BRAIN mission in sequence

## Definition of Done

- [ ] Kennis-catalogus in Context Engine verbreden module exists under src/atlas/
- [ ] src/atlas/brain/context/ContextBuilder.ts (collectKnowledgeContext() — haalt nu de echte catalogus op via tryGetActiveModule().getArticleCatalog(), filtert stub-only artikelen eruit, rangschikt op onderwerp-relevantie) implemented per mission scope
- [ ] src/atlas/publishing/plugin/registry.ts (tryGetActiveModule — bestaande, module-onafhankelijke abstractie, al gebruikt door studioService.ts) implemented per mission scope
- [ ] src/modules/doughbert/plugin.ts (getArticleCatalog() — bestaande implementatie, ongewijzigd) implemented per mission scope
- [ ] src/atlas/brain/context/ContextSnapshot.ts (deriveContextHealth() gelezen ter verificatie — kennis bleek geen onderdeel van de health-berekening te zijn; alleen de documentatie hierover was onjuist, niet de code) implemented per mission scope
- [ ] Constraint respected: Geen directe import van doughbert-specifieke bestanden in de Context Engine — alleen via de bestaande module-abstractie (tryGetActiveModule), zodat de Context Engine module-onafhankelijk blijft
- [ ] Constraint respected: Alleen artikelen met echte inhoud (samenvatting of minstens één sectie) worden meegenomen — nooit een titel-only stub, zelfde regel als hasRealKnowledgeContent elders in de codebase
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-007 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Context-snapshots die de Decision Engine voedt bevatten nu echte, onderwerp-relevante kennis uit de gepubliceerde artikelcatalogus in plaats van drie vaste, betekenisloze placeholder-strings.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-007
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for BRAIN-007"
- npm run atlas:mission BRAIN-007

## Commands to run before finishing

```bash
npm run atlas:mission BRAIN-007
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

Context-snapshots die de Decision Engine voedt bevatten nu echte, onderwerp-relevante kennis uit de gepubliceerde artikelcatalogus in plaats van drie vaste, betekenisloze placeholder-strings.

---

_Generated by Atlas Mission Orchestrator · 2026-07-10T21:25:22.986Z_
