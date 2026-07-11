# Audit Checklist — CONTENT-008

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **CONTENT-008**
- Title · **Overgeslagen artikel Kamertemperatuur alsnog schrijven**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T19:19:31.008Z

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
- [ ] npm run atlas:mission CONTENT-008 regenerates package

## Mission-specific checks

- [ ] Overgeslagen artikel Kamertemperatuur alsnog schrijven module exists under src/atlas/
- [ ] scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-008"]) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/temperaturen/index.ts (bevat al de 5 andere temperaturen-artikelen — blijft ongewijzigd) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/temperaturen-kamertemperatuur/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van temperaturen/index.ts zodat de al toegepaste 5 artikelen niet worden overschreven) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub voor kamertemperatuur) implemented per mission scope
- [ ] Constraint respected: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint respected: Alleen als het artikel de publicatiedrempel haalt (minimaal 3 echte secties + samenvatting) wordt het meegenomen; blijft het te dun, dan wordt dat gerapporteerd en blijft de bestaande stub gewoon staan
- [ ] Constraint respected: De 5 al toegepaste temperaturen-artikelen worden niet opnieuw gegenereerd en niet overschreven
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-008 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Het kamertemperatuur-artikel toont echte, leesbare content in de Kennisbibliotheek (categorie temperaturen) in plaats van een lege pagina, geschreven door de echte agent-ploeg.

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
