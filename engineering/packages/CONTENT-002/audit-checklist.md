# Audit Checklist — CONTENT-002

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **CONTENT-002**
- Title · **Kennisartikelen Hydratatie vullen**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-08T20:03:50.776Z

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
- [ ] npm run atlas:mission CONTENT-002 regenerates package

## Mission-specific checks

- [ ] Kennisartikelen Hydratatie vullen module exists under src/atlas/
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de 6 hydratatie-stubs — vul hier per entry een echt `content: { summary, sections }` veld en zet status op "published" zodra een entry echt gevuld is) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/flour/tarwebloem.ts (kwaliteitsvoorbeeld: een volledig artikel — 8-11 secties via createStandardSection, met een goed geschreven summary — dit is de lat, geen mission om onder te gaan zitten) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/painDeCampagneKnowledge.ts (bevat een echt geschreven hydrationScience-blok — bruikbare, al bestaande feiten over hydratatie, hergebruik deze in plaats van nieuwe cijfers te verzinnen) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/knowledgeBiteContent.ts (createStandardSection, createKnowledgeBiteSection, mergeKnowledgeBiteBody — bestaande helpers, hergebruiken) implemented per mission scope
- [ ] src/modules/doughbert/types/knowledgeBite.ts (KnowledgeBiteSectionId — alleen deze vaste set section-ids gebruiken: what-is-it, properties, comparison, science, when-to-use, when-not-to-use, common-mistakes, doughbert-tip, faq, did-you-know) implemented per mission scope
- [ ] Constraint respected: Verzin geen baktechnische claims die nergens in de repository of in gangbare, algemeen bekende bakkennis onderbouwd zijn — bij twijfel liever een sectie weglaten dan een onjuist feit opnemen
- [ ] Constraint respected: Gebruik alleen de vaste KnowledgeBiteSectionId-waarden, geen nieuwe section-ids verzinnen
- [ ] Constraint respected: Zet status alleen op "published" voor een entry die ook echt gevulde sections heeft — nooit blind alles wijzigen
- [ ] Constraint respected: Raak de mock AI Studio en de publicationStore-pipeline niet aan — dat is een apart, bewust ongebruikt systeem
- [ ] Constraint respected: Klein en gefocust: dit is alleen de "hydratatie"-categorie (6 artikelen) — de andere vijf lege categorieën (bakwetenschap, technieken, starter, fermentatie, temperaturen) zijn expliciet geen onderdeel van deze mission en volgen later als eigen mission
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-002 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Alle 6 artikelen in de hydratatie-categorie tonen echte, leesbare content in de Kennisbibliotheek in plaats van een lege pagina, met een kwaliteitsniveau vergelijkbaar met de meel-bloem categorie.

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
