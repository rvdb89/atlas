# Voorgestelde implementatie — CONTENT-003 · Content: temperaturen

**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), en verwijder deze proposed-changes/ map daarna.

## Echte context meegegeven aan Claude
- `temperaturen/deegtemperatuur (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `temperaturen/watertemperatuur-berekenen (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `temperaturen/oventemperaturen (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `temperaturen/temperatuur-fermentatie (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)
- `temperaturen/koelkast-fermentatie-temperatuur (echte AI-generatie, geen bestaand bestand)` (echte inhoud gelezen van disk)

## Samenvatting
5 van de 6 temperaturen-artikelen geschreven door het echte copywriter-team (real AI, geen mock), fact-checked en gelinkt — niet door de generieke code-schrijver.

## Voorgestelde bestanden (3)
- **create** `src/modules/doughbert/knowledge/temperaturen/index.ts` — 5/6 artikelen in de temperaturen-categorie, echt geschreven door het copywriter/fact-checker/link-engine team.
- **modify** `src/modules/doughbert/knowledge/collectSources.ts` — Registreert temperaturenArticles in de centrale artikel-collectie.
- **modify** `src/modules/doughbert/knowledge/bulk/catalogArticles.ts` — Verwijdert 5 title-only stub(s) die nu vervangen zijn door echte content — voorkomt dat de oude lege placeholder de nieuwe content in de dedup verdringt.

## Geweigerd door veiligheidscontrole (1)
- `kamertemperatuur` — Geen contentPayload ontvangen van de copywriter.

## Risico's
- Kamertemperatuur (kamertemperatuur) overgeslagen: Geen contentPayload ontvangen van de copywriter.

## Vervolgstap
1 artikel(en) overgeslagen (zie risico's) — draai deze missie opnieuw om ze alsnog te proberen, of vul ze later handmatig aan.