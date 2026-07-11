# Voorgestelde implementatie — CONTENT-010 · Content: technieken

**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), en verwijder deze proposed-changes/ map daarna.

## Echte context meegegeven aan Claude
- `technieken/handmatig-mengen (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/slap-and-fold (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/lamineren (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/bassinage (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/preshape (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/final-shape (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/boule-vormen (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/batard-vormen (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/banneton-gebruiken (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/dutch-oven-bakken (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/pizza-uitrekken (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/pizza-draaien (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/pizza-bakken-op-staal (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `technieken/pizza-bakken-op-steen (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)

## Samenvatting
14 van de 17 technieken-artikelen geschreven door het echte copywriter-team (real AI, geen mock), fact-checked en gelinkt — niet door de generieke code-schrijver.

## Voorgestelde bestanden (3)
- **create** `src/modules/doughbert/knowledge/technieken-retry/index.ts` — 14/17 artikelen in de technieken-categorie, echt geschreven door het copywriter/fact-checker/link-engine team.
- **modify** `src/modules/doughbert/knowledge/collectSources.ts` — Registreert techniekenRetryArticles in de centrale artikel-collectie.
- **modify** `src/modules/doughbert/knowledge/bulk/catalogArticles.ts` — Verwijdert 14 title-only stub(s) die nu vervangen zijn door echte content — voorkomt dat de oude lege placeholder de nieuwe content in de dedup verdringt.

## Geweigerd door veiligheidscontrole (3)
- `scoren` — Geen contentPayload ontvangen van de copywriter. Echte oorzaak: de AI-aanroep mislukte stil en viel terug op een placeholder (echte aanroep mislukte (Claude structured response was not valid JSON (Expected ',' or ']' after array element in JSON at position 5535 (line 1 column 5536)). output_tokens: 5681/8000. Last 200 chars of raw response: "wenlang bestaat, is het decoratieve scoren met complexe patronen pas de laatste decennia sterk in populariteit gegroeid, mede dankzij de opkomst van artisanale bakkerijen en zichtbare bakblogs.\"}]}]}}"), placeholder-antwoord gebruikt in plaats van een fout · draft ready · GEEN contentPayload in AI-antwoord).
- `ovenspring-creeren` — Geen contentPayload ontvangen van de copywriter. Echte oorzaak: de AI-aanroep mislukte stil en viel terug op een placeholder (echte aanroep mislukte (Claude structured response was not valid JSON (Expected double-quoted property name in JSON at position 4862 (line 1 column 4863)). output_tokens: 6350/8000. Last 200 chars of raw response: "e hoogte en de manier waarop de 'oren' langs een baguette openklappen, worden door professionele juryleden bij bakwedstrijden gebruikt als visuele indicator voor correct uitgevoerde ovenspring.\"}]}]}}"), placeholder-antwoord gebruikt in plaats van een fout · draft ready · GEEN contentPayload in AI-antwoord).
- `pizza-lanceren` — Geen contentPayload ontvangen van de copywriter. Echte oorzaak: de AI-aanroep mislukte stil en viel terug op een placeholder (echte aanroep mislukte (Claude structured response was not valid JSON (Expected double-quoted property name in JSON at position 6065 (line 1 column 6066)). output_tokens: 6041/8000. Last 200 chars of raw response: "wege de smaak, maar puur vanwege zijn grovere, rondere korrelstructuur die als een soort kogellager onder het deeg werkt.\"}],\"keyPoints\":[],\"relatedKnowledge\":[\"geschiedenis van pizza-uitrusting\"]}]}}"), placeholder-antwoord gebruikt in plaats van een fout · draft ready · GEEN contentPayload in AI-antwoord).

## Risico's
- Scoren (scoren) overgeslagen: Geen contentPayload ontvangen van de copywriter. Echte oorzaak: de AI-aanroep mislukte stil en viel terug op een placeholder (echte aanroep mislukte (Claude structured response was not valid JSON (Expected ',' or ']' after array element in JSON at position 5535 (line 1 column 5536)). output_tokens: 5681/8000. Last 200 chars of raw response: "wenlang bestaat, is het decoratieve scoren met complexe patronen pas de laatste decennia sterk in populariteit gegroeid, mede dankzij de opkomst van artisanale bakkerijen en zichtbare bakblogs.\"}]}]}}"), placeholder-antwoord gebruikt in plaats van een fout · draft ready · GEEN contentPayload in AI-antwoord).
- Ovenspring creëren (ovenspring-creeren) overgeslagen: Geen contentPayload ontvangen van de copywriter. Echte oorzaak: de AI-aanroep mislukte stil en viel terug op een placeholder (echte aanroep mislukte (Claude structured response was not valid JSON (Expected double-quoted property name in JSON at position 4862 (line 1 column 4863)). output_tokens: 6350/8000. Last 200 chars of raw response: "e hoogte en de manier waarop de 'oren' langs een baguette openklappen, worden door professionele juryleden bij bakwedstrijden gebruikt als visuele indicator voor correct uitgevoerde ovenspring.\"}]}]}}"), placeholder-antwoord gebruikt in plaats van een fout · draft ready · GEEN contentPayload in AI-antwoord).
- Pizza lanceren (pizza-lanceren) overgeslagen: Geen contentPayload ontvangen van de copywriter. Echte oorzaak: de AI-aanroep mislukte stil en viel terug op een placeholder (echte aanroep mislukte (Claude structured response was not valid JSON (Expected double-quoted property name in JSON at position 6065 (line 1 column 6066)). output_tokens: 6041/8000. Last 200 chars of raw response: "wege de smaak, maar puur vanwege zijn grovere, rondere korrelstructuur die als een soort kogellager onder het deeg werkt.\"}],\"keyPoints\":[],\"relatedKnowledge\":[\"geschiedenis van pizza-uitrusting\"]}]}}"), placeholder-antwoord gebruikt in plaats van een fout · draft ready · GEEN contentPayload in AI-antwoord).

## Vervolgstap
3 artikel(en) overgeslagen (zie risico's) — draai deze missie opnieuw om ze alsnog te proberen, of vul ze later handmatig aan.