# Execution Package — CONTENT-001

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (5/10)

- Mission CONTENT-001 is on the Constitution roadmap (Every recipe-linked Knowledge page is an auto-generated 'draft' stub with no real body, even where the recipe itself already has real written content (introduction, tips, a full RecipeKnowledge object for Pain de Campagne) — closes the gap using the Execution + Apply Engine loop, not a new pipeline).
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
- **Selected mission:** CONTENT-001
- **Recommended Next Initiative:** ATLAS-001

Mijn advies is om Content te verbeteren.
Reden: Content is zeer laag volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Recipe Knowledge Content Wiring (CONTENT-001). Mission ID CONTENT-001 provided — evolution assessment confirms alignment. Roadmap context: Every recipe-linked Knowledge page is an auto-generated 'draft' stub with no real body, even where the recipe itself already has real written content (introduction, tips, a full RecipeKnowledge object for Pain de Campagne) — closes the gap using the Execution + Apply Engine loop, not a new pipeline Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected CONTENT-001 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 75%. Developing: Memory, Context, Planning, Execution, Content. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Content (70% gap), Memory (25% gap), Planning (22% gap), Context (15% gap), Execution (15% gap), Orchestration (10% gap)
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
- **Recommended Evolution** (pass) — CONTENT-001 · Recipe Knowledge Content Wiring
- **Mission Registry** (pass) — CONTENT-001 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
CONTENT-001
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

- **Mission ID:** CONTENT-001
- **Title:** Recipe Knowledge Content Wiring
- **Registry source:** engineering/missions/CONTENT-001.mission
- **Template:** engineering
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-08T18:57:01.213Z

## Goal

Elke Kennis-pagina die gekoppeld is aan een recept (Brood/Pizza) toont vandaag een lege placeholder: buildRecipeArticles() genereert voor elk recept met een knowledgeBiteId automatisch een Knowledge Bite met status "draft", lege summary en nul sections — ook voor recepten die zelf al echte, geschreven content hebben (introduction, tips, en voor Pain de Campagne een volledig ingevuld RecipeKnowledge-object dat nergens in de Kennis-flow terechtkomt). Los dit structureel op door het al bestaande, echte recept-materiaal te koppelen aan het gegenereerde Knowledge Bite artikel. Dit is een koppel-taak, geen contentgeneratie-taak: er wordt niets verzonnen dat niet al ergens in het recept staat.

## Implementation focus

- src/modules/doughbert/knowledge/bulk/recipeArticles.ts (buildRecipeArticles — hier wordt vandaag alleen de tagline gekopieerd als subtitle; content-overrides zoals summary/sections ontbreken volledig)
- src/modules/doughbert/recipes/breadRecipes.ts (Pain de Campagne heeft al knowledge: painDeCampagneKnowledge — een compleet, echt RecipeKnowledge-object; gebruik dit als het duidelijkste voorbeeld)
- src/modules/doughbert/recipes/recipes.ts (recept-registry voor Pizza — zelfde patroon, controleer welke recepten al introduction/tips/knowledge hebben)
- src/modules/doughbert/knowledge/knowledgeBiteContent.ts (mergeKnowledgeBiteBody, createStandardSection, createKnowledgeBiteSection — bestaande helpers, hergebruiken, niet dupliceren)
- src/modules/doughbert/types/recipe.ts (Recipe/RecipeKnowledge/RecipeStep shape — alleen lezen, niet wijzigen)
- src/types/knowledgeBite.ts (KnowledgeBiteBody/Section schema — alleen lezen)

## Constraints

- Verzin geen nieuwe bakfeiten of tekst die niet al ergens in recipe.introduction, recipe.tips, recipe.steps of recipe.knowledge staat — dit is uitsluitend een koppel-fix, geen content-schrijftaak
- Zet status pas op iets anders dan "draft" voor een specifiek recept zodra dat recept echt gevulde sections heeft — nooit blind alles op "published" zetten
- Raak de mock AI Studio (runMockAiTask) en de publicationStore-pipeline (studioService, PublishingPipeline) niet aan — dat is een bewust apart, ongebruikt systeem en geen onderdeel van deze mission
- Klein en gefocust: als niet alle recepten in een enkel voorstel passen, geef in ieder geval elk recept met een bestaand knowledge-object (zoals Pain de Campagne) een echt gevuld artikel, en noem de rest expliciet in de follow-up
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

_No upstream mission dependencies inferred._

## Definition of Done

- [ ] Recipe Knowledge Content Wiring module exists under src/atlas/
- [ ] src/modules/doughbert/knowledge/bulk/recipeArticles.ts (buildRecipeArticles — hier wordt vandaag alleen de tagline gekopieerd als subtitle; content-overrides zoals summary/sections ontbreken volledig) implemented per mission scope
- [ ] src/modules/doughbert/recipes/breadRecipes.ts (Pain de Campagne heeft al knowledge: painDeCampagneKnowledge — een compleet, echt RecipeKnowledge-object; gebruik dit als het duidelijkste voorbeeld) implemented per mission scope
- [ ] src/modules/doughbert/recipes/recipes.ts (recept-registry voor Pizza — zelfde patroon, controleer welke recepten al introduction/tips/knowledge hebben) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/knowledgeBiteContent.ts (mergeKnowledgeBiteBody, createStandardSection, createKnowledgeBiteSection — bestaande helpers, hergebruiken, niet dupliceren) implemented per mission scope
- [ ] src/modules/doughbert/types/recipe.ts (Recipe/RecipeKnowledge/RecipeStep shape — alleen lezen, niet wijzigen) implemented per mission scope
- [ ] src/types/knowledgeBite.ts (KnowledgeBiteBody/Section schema — alleen lezen) implemented per mission scope
- [ ] Constraint respected: Verzin geen nieuwe bakfeiten of tekst die niet al ergens in recipe.introduction, recipe.tips, recipe.steps of recipe.knowledge staat — dit is uitsluitend een koppel-fix, geen content-schrijftaak
- [ ] Constraint respected: Zet status pas op iets anders dan "draft" voor een specifiek recept zodra dat recept echt gevulde sections heeft — nooit blind alles op "published" zetten
- [ ] Constraint respected: Raak de mock AI Studio (runMockAiTask) en de publicationStore-pipeline (studioService, PublishingPipeline) niet aan — dat is een bewust apart, ongebruikt systeem en geen onderdeel van deze mission
- [ ] Constraint respected: Klein en gefocust: als niet alle recepten in een enkel voorstel passen, geef in ieder geval elk recept met een bestaand knowledge-object (zoals Pain de Campagne) een echt gevuld artikel, en noem de rest expliciet in de follow-up
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Kennis-pagina's voor recepten die al bronmateriaal hebben (introduction/tips/knowledge) tonen dat materiaal echt, in plaats van een lege "draft" pagina — zichtbaar via de Kennis-categorieschermen (Brood/Pizza).

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission CONTENT-001
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for CONTENT-001"
- npm run atlas:mission CONTENT-001

## Commands to run before finishing

```bash
npm run atlas:mission CONTENT-001
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

Kennis-pagina's voor recepten die al bronmateriaal hebben (introduction/tips/knowledge) tonen dat materiaal echt, in plaats van een lege "draft" pagina — zichtbaar via de Kennis-categorieschermen (Brood/Pizza).

---

_Generated by Atlas Mission Orchestrator · 2026-07-08T18:57:01.213Z_
