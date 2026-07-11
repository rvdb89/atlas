# Voorgestelde implementatie — BRAIN-007 · Kennis-catalogus in Context Engine verbreden

**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), en verwijder deze proposed-changes/ map daarna.

## Echte context meegegeven aan Claude
- `src/atlas/ai/context/builder.ts` (echte inhoud gelezen van disk)
- `src/atlas/ai/context/index.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/context/ContextBuilder.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/context/ContextEngine.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/context/ContextRegistry.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/context/ContextResolver.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/context/ContextSnapshot.test.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/context/ContextSnapshot.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/context/bootstrap.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/context/context.types.ts` (echte inhoud gelezen van disk)
- `src/atlas/auditor/AuditContext.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/MemoryContext.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/planner/PlanningContext.ts` (echte inhoud gelezen van disk)
- `src/atlas/studio/os/StudioOsContext.tsx` (echte inhoud gelezen van disk)
- `src/atlas/studio/proof-of-power/ContextSnapshotViewer.tsx` (echte inhoud gelezen van disk)
- `scripts/atlas/audit-context.ts` (echte inhoud gelezen van disk)
- `src/atlas/publishing/plugin/registry.ts` (echte inhoud gelezen van disk)
- `src/modules/doughbert/plugin.ts` (echte inhoud gelezen van disk)
- `engineering/briefs/BRAIN-007.md` (echte inhoud gelezen van disk)

## Samenvatting
De missie is al volledig opgeleverd: ContextBuilder.ts's collectKnowledgeContext() haalt al de echte catalogus op via tryGetActiveModule().getArticleCatalog(), filtert stub-only artikelen met hasRealArticleContent() en rangschikt op onderwerp-relevantie, precies zoals gevraagd. Ook registry.ts (tryGetActiveModule), plugin.ts (getArticleCatalog) en ContextSnapshot.ts (deriveContextHealth, met bijbehorende regressietest) zijn al conform de brief.

## Voorgestelde bestanden (0)
_Geen bestanden voorgesteld._

## Risico's
- Geen nieuwe code toegevoegd terwijl de missie mogelijk nog als 'open' geregistreerd staat in de mission registry, wat verwarring kan geven over de status.

## Vervolgstap
Controleer of de mission registry (engineering/missions/BRAIN-007.mission) nog als open/pending staat en markeer deze als voltooid, aangezien de implementatie in ContextBuilder.ts, registry.ts, plugin.ts en ContextSnapshot.ts al aanwezig en consistent met de brief is; draai ter bevestiging npx tsc --noEmit en npm run atlas:audit -- --strict om te verifiëren dat er geen regressie is.