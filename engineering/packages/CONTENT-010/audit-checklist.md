# Audit Checklist — CONTENT-010

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **CONTENT-010**
- Title · **Retry: 17 overgeslagen technieken-artikelen**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T19:35:28.034Z

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
- [ ] npm run atlas:mission CONTENT-010 regenerates package

## Mission-specific checks

- [ ] Retry: 17 overgeslagen technieken-artikelen module exists under src/atlas/
- [ ] scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-010"]) implemented per mission scope
- [ ] src/atlas/ai/providers/transport/createClaudeTransport.ts (de eigenlijke bugfix — retry met backoff vóór terugvallen op een placeholder) implemented per mission scope
- [ ] src/atlas/ai/core/Orchestrator.ts (formatTaskExecutionLog — toont nu duidelijk wanneer een aanroep stil terugviel) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/techniques/index.ts (bevat al de 5 gelukte technieken-artikelen — blijft ongewijzigd) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/technieken-retry/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van techniques/index.ts zodat de 5 al toegepaste artikelen niet worden overschreven) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de stubs van artikelen die deze keer wél lukken) implemented per mission scope
- [ ] Constraint respected: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint respected: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; blijft een artikel te dun of mislukt de aanroep opnieuw, dan wordt dat gerapporteerd met de echte oorzaak (niet de generieke "geen contentPayload"-melding) en blijft de bestaande stub staan
- [ ] Constraint respected: De 5 al toegepaste technieken-artikelen worden niet opnieuw gegenereerd en niet overschreven
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-010 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Zoveel mogelijk van de 17 artikelen tonen echte, leesbare content in de Kennisbibliotheek (categorie technieken) in plaats van een lege pagina — en als er nog artikelen overblijven, is de gerapporteerde reden nu de echte technische oorzaak, niet een onbruikbare generieke melding.

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
