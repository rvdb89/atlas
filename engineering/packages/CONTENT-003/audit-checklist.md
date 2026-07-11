# Audit Checklist — CONTENT-003

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **CONTENT-003**
- Title · **Kennisartikelen Temperaturen vullen**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-09T19:16:06.594Z

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
- [ ] npm run atlas:mission CONTENT-003 regenerates package

## Mission-specific checks

- [ ] Kennisartikelen Temperaturen vullen module exists under src/atlas/
- [ ] scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-003"]) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld waar de agent-ploeg naar streeft) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/temperaturen/index.ts (nieuw bestand, wordt aangemaakt) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen) implemented per mission scope
- [ ] Constraint respected: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint respected: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd, nooit als lege of halve pagina gepubliceerd
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-003 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Alle 6 artikelen in de temperaturen-categorie tonen echte, leesbare content in de Kennisbibliotheek in plaats van een lege pagina, geschreven door de echte agent-ploeg.

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
