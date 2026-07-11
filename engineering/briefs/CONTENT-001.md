# Architecture Brief — CONTENT-001

## Titel

# CONTENT-001 — Recipe Knowledge Content Wiring

## Mission Metadata

- Mission ID · **CONTENT-001**
- Title · **Recipe Knowledge Content Wiring**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-08T18:57:01.212Z

## Doel

Elke Kennis-pagina die gekoppeld is aan een recept (Brood/Pizza) toont vandaag een lege placeholder: buildRecipeArticles() genereert voor elk recept met een knowledgeBiteId automatisch een Knowledge Bite met status "draft", lege summary en nul sections — ook voor recepten die zelf al echte, geschreven content hebben (introduction, tips, en voor Pain de Campagne een volledig ingevuld RecipeKnowledge-object dat nergens in de Kennis-flow terechtkomt). Los dit structureel op door het al bestaande, echte recept-materiaal te koppelen aan het gegenereerde Knowledge Bite artikel. Dit is een koppel-taak, geen contentgeneratie-taak: er wordt niets verzonnen dat niet al ergens in het recept staat.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- src/modules/doughbert/knowledge/bulk/recipeArticles.ts (buildRecipeArticles — hier wordt vandaag alleen de tagline gekopieerd als subtitle; content-overrides zoals summary/sections ontbreken volledig)
- src/modules/doughbert/recipes/breadRecipes.ts (Pain de Campagne heeft al knowledge: painDeCampagneKnowledge — een compleet, echt RecipeKnowledge-object; gebruik dit als het duidelijkste voorbeeld)
- src/modules/doughbert/recipes/recipes.ts (recept-registry voor Pizza — zelfde patroon, controleer welke recepten al introduction/tips/knowledge hebben)
- src/modules/doughbert/knowledge/knowledgeBiteContent.ts (mergeKnowledgeBiteBody, createStandardSection, createKnowledgeBiteSection — bestaande helpers, hergebruiken, niet dupliceren)
- src/modules/doughbert/types/recipe.ts (Recipe/RecipeKnowledge/RecipeStep shape — alleen lezen, niet wijzigen)
- src/types/knowledgeBite.ts (KnowledgeBiteBody/Section schema — alleen lezen)

## Niet doen

- Verzin geen nieuwe bakfeiten of tekst die niet al ergens in recipe.introduction, recipe.tips, recipe.steps of recipe.knowledge staat — dit is uitsluitend een koppel-fix, geen content-schrijftaak
- Zet status pas op iets anders dan "draft" voor een specifiek recept zodra dat recept echt gevulde sections heeft — nooit blind alles op "published" zetten
- Raak de mock AI Studio (runMockAiTask) en de publicationStore-pipeline (studioService, PublishingPipeline) niet aan — dat is een bewust apart, ongebruikt systeem en geen onderdeel van deze mission
- Klein en gefocust: als niet alle recepten in een enkel voorstel passen, geef in ieder geval elk recept met een bestaand knowledge-object (zoals Pain de Campagne) een echt gevuld artikel, en noem de rest expliciet in de follow-up
- TypeScript blijft compileren zonder nieuwe errors
- Geen breaking changes
- Geen ongevraagde refactors
- Geen externe database zonder expliciete opdracht

## Architectuur

### Principes
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

### Mission Architecture
- Implement src/modules/doughbert/knowledge/bulk/recipeArticles.ts (buildRecipeArticles — hier wordt vandaag alleen de tagline gekopieerd als subtitle; content-overrides zoals summary/sections ontbreken volledig) using registry-based Atlas patterns.
- Implement src/modules/doughbert/recipes/breadRecipes.ts (Pain de Campagne heeft al knowledge: painDeCampagneKnowledge — een compleet, echt RecipeKnowledge-object; gebruik dit als het duidelijkste voorbeeld) using registry-based Atlas patterns.
- Implement src/modules/doughbert/recipes/recipes.ts (recept-registry voor Pizza — zelfde patroon, controleer welke recepten al introduction/tips/knowledge hebben) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/knowledgeBiteContent.ts (mergeKnowledgeBiteBody, createStandardSection, createKnowledgeBiteSection — bestaande helpers, hergebruiken, niet dupliceren) using registry-based Atlas patterns.
- Implement src/modules/doughbert/types/recipe.ts (Recipe/RecipeKnowledge/RecipeStep shape — alleen lezen, niet wijzigen) using registry-based Atlas patterns.
- Implement src/types/knowledgeBite.ts (KnowledgeBiteBody/Section schema — alleen lezen) using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Recipe Knowledge Content Wiring under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver src/modules/doughbert/knowledge/bulk/recipeArticles.ts (buildRecipeArticles — hier wordt vandaag alleen de tagline gekopieerd als subtitle; content-overrides zoals summary/sections ontbreken volledig) with rule-based local logic
- Deliver src/modules/doughbert/recipes/breadRecipes.ts (Pain de Campagne heeft al knowledge: painDeCampagneKnowledge — een compleet, echt RecipeKnowledge-object; gebruik dit als het duidelijkste voorbeeld) with rule-based local logic
- Deliver src/modules/doughbert/recipes/recipes.ts (recept-registry voor Pizza — zelfde patroon, controleer welke recepten al introduction/tips/knowledge hebben) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/knowledgeBiteContent.ts (mergeKnowledgeBiteBody, createStandardSection, createKnowledgeBiteSection — bestaande helpers, hergebruiken, niet dupliceren) with rule-based local logic
- Deliver src/modules/doughbert/types/recipe.ts (Recipe/RecipeKnowledge/RecipeStep shape — alleen lezen, niet wijzigen) with rule-based local logic
- Deliver src/types/knowledgeBite.ts (KnowledgeBiteBody/Section schema — alleen lezen) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission CONTENT-001 advances Recipe Knowledge Content Wiring toward Atlas autonomy

## Definition of Done

- [ ] Recipe Knowledge Content Wiring module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Kennis-pagina's voor recepten die al bronmateriaal hebben (introduction/tips/knowledge) tonen dat materiaal echt, in plaats van een lege "draft" pagina — zichtbaar via de Kennis-categorieschermen (Brood/Pizza).
- [ ] Constraint gerespecteerd: Verzin geen nieuwe bakfeiten of tekst die niet al ergens in recipe.introduction, recipe.tips, recipe.steps of recipe.knowledge staat — dit is uitsluitend een koppel-fix, geen content-schrijftaak
- [ ] Constraint gerespecteerd: Zet status pas op iets anders dan "draft" voor een specifiek recept zodra dat recept echt gevulde sections heeft — nooit blind alles op "published" zetten
- [ ] Constraint gerespecteerd: Raak de mock AI Studio (runMockAiTask) en de publicationStore-pipeline (studioService, PublishingPipeline) niet aan — dat is een bewust apart, ongebruikt systeem en geen onderdeel van deze mission
- [ ] Constraint gerespecteerd: Klein en gefocust: als niet alle recepten in een enkel voorstel passen, geef in ieder geval elk recept met een bestaand knowledge-object (zoals Pain de Campagne) een echt gevuld artikel, en noem de rest expliciet in de follow-up
- [ ] Constraint gerespecteerd: TypeScript blijft compileren zonder nieuwe errors

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert CONTENT-001.md
- npm run atlas:mission CONTENT-001 genereert engineering package
- Mission CONTENT-001 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/CONTENT-001.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor CONTENT-001 gebruiken
- Success criteria: Kennis-pagina's voor recepten die al bronmateriaal hebben (introduction/tips/knowledge) tonen dat materiaal echt, in plaats van een lege "draft" pagina — zichtbaar via de Kennis-categorieschermen (Brood/Pizza).

---

_Generated by Atlas Mission Brief Generator · 2026-07-08T18:57:01.213Z_
