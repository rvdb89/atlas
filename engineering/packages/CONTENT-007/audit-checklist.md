# Audit Checklist — CONTENT-007

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **CONTENT-007**
- Title · **Kennisartikelen Technieken vullen**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-09T22:28:11.962Z

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
- [ ] npm run atlas:mission CONTENT-007 regenerates package

## Mission-specific checks

- [ ] Kennisartikelen Technieken vullen module exists under src/atlas/
- [ ] scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-007"]) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/techniques/index.ts (bestaande lege map, wordt gevuld — categoryId blijft het Nederlandse "technieken", alleen de mapnaam op disk is Engels omdat die al zo was aangemaakt) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen) implemented per mission scope
- [ ] Constraint respected: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint respected: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd
- [ ] Constraint respected: 22 losse AI-aanroepen na elkaar — reken op een aanzienlijk langere cyclusduur dan de andere content-missies; overweeg desnoods deze mission in delen te draaien als één cyclus te lang duurt
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-007 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Alle 22 artikelen in de technieken-categorie tonen echte, leesbare content in de Kennisbibliotheek, geschreven door de echte agent-ploeg.

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
