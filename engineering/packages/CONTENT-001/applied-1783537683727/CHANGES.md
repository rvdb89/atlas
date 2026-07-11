# Voorgestelde implementatie — CONTENT-001 · Recipe Knowledge Content Wiring

**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), en verwijder deze proposed-changes/ map daarna.

## Echte context meegegeven aan Claude
- `src/atlas/ai/prompts/knowledge/index.ts` (echte inhoud gelezen van disk)
- `src/atlas/ai/prompts/recipe/index.ts` (echte inhoud gelezen van disk)
- `src/modules/doughbert/knowledge/bulk/recipeArticles.ts` (echte inhoud gelezen van disk)
- `src/modules/doughbert/recipes/breadRecipes.ts` (echte inhoud gelezen van disk)
- `src/modules/doughbert/recipes/recipes.ts` (echte inhoud gelezen van disk)
- `src/modules/doughbert/knowledge/knowledgeBiteContent.ts` (echte inhoud gelezen van disk)
- `src/modules/doughbert/types/recipe.ts` (echte inhoud gelezen van disk)
- `src/types/knowledgeBite.ts` (echte inhoud gelezen van disk)
- `engineering/briefs/CONTENT-001.md` (echte inhoud gelezen van disk)

## Samenvatting
buildRecipeArticles() koppelt nu recipe.introduction en recipe.tips als echte contentOverrides (summary + doughbertAdvice) aan elk gegenereerd Knowledge Bite artikel, in plaats van alles leeg te laten; status blijft bewust "draft" totdat er ook echte sections zijn. De structurele koppeling van recipe.knowledge (RecipeKnowledge, o.a. Pain de Campagne) naar volledige sections kon niet veilig worden meegenomen omdat het schema van dat type niet is meegeleverd.

## Voorgestelde bestanden (1)
- **modify** `src/modules/doughbert/knowledge/bulk/recipeArticles.ts` — Koppelt het al bestaande recipe.introduction en recipe.tips daadwerkelijk aan het gegenereerde Knowledge Bite artikel in plaats van een lege summary en nul secties te laten staan.

## Risico's
- Ik heb aangenomen dat KnowledgeArticleInput (src/types/knowledgeArticleInput.ts, niet in existingFiles) een veld 'contentOverrides' van het type Partial<KnowledgeBiteBody> ondersteunt — dit is gebaseerd op de expliciete term 'content-overrides' in de architecture brief en het bestaande metadataOverrides/contentOverrides-patroon in knowledgeBiteContent.ts, maar is niet geverifieerd tegen de echte typedefinitie.
- Als KnowledgeArticleInput dat veld niet heeft, geeft TypeScript een 'object literal may only specify known properties'-fout op contentOverrides en moet dat type-bestand alsnog worden uitgebreid.
- recipe.knowledge (RecipeKnowledge, o.a. painDeCampagneKnowledge) is bewust niet gekoppeld omdat het schema van RecipeKnowledge (src/types/knowledge.ts) niet is meegeleverd — zonder dat schema zou ik de structuur van de secties moeten gokken.

## Vervolgstap
Controleer of src/types/knowledgeArticleInput.ts daadwerkelijk een contentOverrides-veld heeft dat overeenkomt met Partial<KnowledgeBiteBody>; voeg dat veld toe aan het type als het nog ontbreekt. Lees vervolgens src/types/knowledge.ts (RecipeKnowledge shape) en src/modules/doughbert/types/knowledgeBite.ts (KnowledgeBiteSectionId enum) om painDeCampagneKnowledge en de overige recept-secties (via createStandardSection/createKnowledgeBiteSection) echt als sections te koppelen — dat is het grootste resterende gat uit de missie. Controleer daarna welke recepten (bagels, focaccia, brioche, meergranen, alle pizza's) al voldoende introduction/tips hebben om ook hun status buiten 'draft' te zetten zodra er ook echte sections zijn, en welke consumer van buildRecipeArticles() de contentOverrides daadwerkelijk toepast op het uiteindelijke Knowledge Bite artikel.