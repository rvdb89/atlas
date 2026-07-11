# Audit Checklist — CONTENT-001

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **CONTENT-001**
- Title · **Recipe Knowledge Content Wiring**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-08T18:57:01.213Z

## Platform audit gates

- [ ] TypeScript compiles clean (npx tsc --noEmit)
- [ ] Atlas health passes (npm run atlas:health)
- [ ] Atlas audit passes (npm run atlas:audit)
- [ ] Strict audit passes (npm run atlas:audit -- --strict)
- [ ] No blockers in audit report
- [ ] Release decision is APPROVED or APPROVED_WITH_NOTES
- [ ] No .env staged or committed
- [ ] No hardcoded API keys in source
- [ ] No Claude references outside provider layer
- [ ] No Doughbert logic in Atlas brain/core
- [ ] npm run atlas:brief still works (backward compatibility)
- [ ] npm run atlas:mission CONTENT-001 regenerates package

## Mission-specific checks

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

## Architecture rules

- [ ] ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- [ ] Generic architecture over vertical coupling
- [ ] Provider independence in Brain and core platform layers
- [ ] Atlas core blijft domein-onafhankelijk
- [ ] Registry pattern voor uitbreidbaarheid
- [ ] Geen vertical-specifieke logica in generieke modules
- [ ] TypeScript-first en strict compileerbaar
- [ ] CLI tools volgen Atlas script conventies
- [ ] Generated artifacts landen in engineering/ directories

## Security standards

- [ ] Geen .env of API keys in source control
- [ ] Geen secrets in logs
- [ ] Provider credentials alleen via environment/config layer
