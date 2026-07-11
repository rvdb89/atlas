# Execution Package — CONTENT-006

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Review needed (0/10)

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
- **Selected mission:** CONTENT-006
- **Recommended Next Initiative:** CONTENT-005

Mijn advies is om Content te verbeteren.
Reden: Content is laag volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Atlas Constitution (ATLAS-000). Mission ID CONTENT-006 provided — evolution assessment confirms alignment. Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected CONTENT-006 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 77%. Developing: Memory, Context, Planning, Execution, Content. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Content (50% gap), Memory (25% gap), Planning (22% gap), Context (15% gap), Execution (15% gap), Orchestration (10% gap)
- **Highest value:** Content

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 10 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 6 platform gap(s) identified
- **Recommended Evolution** (pass) — CONTENT-006 · CONTENT-006
- **Mission Registry** (pass) — CONTENT-006 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
CONTENT-006
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

- **Mission ID:** CONTENT-006
- **Title:** Kennisartikelen Bakwetenschap vullen
- **Registry source:** engineering/missions/CONTENT-006.mission
- **Template:** engineering
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-09T21:13:40.218Z

## Goal

De categorie "bakwetenschap" in de Kennisbibliotheek bestaat uit 12 artikelen (gluten, glutenontwikkeling, eiwitten, enzymen, ash-content, w-waarde, falling-number, osmose, gist, melkzuurbacterien, maillardreactie, karamellisatie) die vandaag alleen een titel hebben. Deze mission wordt uitgevoerd door de echte copywriter/fact-checker/link-engine agent-ploeg (zie scripts/atlas/contentGenerationEngine.ts) in plaats van de generieke code-schrijver.

## Implementation focus

- scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-006"])
- src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld)
- src/modules/doughbert/knowledge/science/index.ts (bestaande lege map, wordt gevuld)
- src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array)
- src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen)

## Constraints

- Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd
- Grootste categorie na technieken — reken op een langere doorlooptijd per cyclus (12 losse AI-aanroepen)
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

- **CONTENT-001** · Recipe Knowledge Content Wiring · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-002** · Kennisartikelen Hydratatie vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-003** · Kennisartikelen Temperaturen vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-004** · Kennisartikelen Fermentatie vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-005** · Kennisartikelen Starter vullen · _requires_ — Prior CONTENT mission in sequence

## Definition of Done

- [ ] Kennisartikelen Bakwetenschap vullen module exists under src/atlas/
- [ ] scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-006"]) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/science/index.ts (bestaande lege map, wordt gevuld) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen) implemented per mission scope
- [ ] Constraint respected: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint respected: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd
- [ ] Constraint respected: Grootste categorie na technieken — reken op een langere doorlooptijd per cyclus (12 losse AI-aanroepen)
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-006 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Alle 12 artikelen in de bakwetenschap-categorie tonen echte, leesbare content in de Kennisbibliotheek, geschreven door de echte agent-ploeg.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission CONTENT-006
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for CONTENT-006"
- npm run atlas:mission CONTENT-006

## Commands to run before finishing

```bash
npm run atlas:mission CONTENT-006
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

Alle 12 artikelen in de bakwetenschap-categorie tonen echte, leesbare content in de Kennisbibliotheek, geschreven door de echte agent-ploeg.

---

_Generated by Atlas Mission Orchestrator · 2026-07-09T21:13:40.218Z_
