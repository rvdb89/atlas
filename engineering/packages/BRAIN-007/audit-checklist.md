# Audit Checklist — BRAIN-007

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **BRAIN-007**
- Title · **Kennis-catalogus in Context Engine verbreden**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:25:22.986Z

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
- [ ] npm run atlas:mission BRAIN-007 regenerates package

## Mission-specific checks

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

## Architecture rules

- [ ] ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- [ ] Generic architecture over vertical coupling
- [ ] Provider independence in Brain and core platform layers
- [ ] Atlas core blijft domein-onafhankelijk
- [ ] Registry pattern voor uitbreidbaarheid
- [ ] Geen vertical-specifieke logica in generieke modules
- [ ] TypeScript-first en strict compileerbaar
- [ ] Brain modules blijven provider-onafhankelijk
- [ ] Geen Claude- of Doughbert-logica in brain core

## Security standards

- [ ] Geen .env of API keys in source control
- [ ] Geen secrets in logs
- [ ] Provider credentials alleen via environment/config layer
