# Atlas Constitution

**Dit document vertaalt de strategische richting van Atlas naar governance, besluitvorming en operationele principes.** Alles wat hieronder valt — organisatie, samenwerking, techniek, product — is ondergeschikt aan wat hier is vastgelegd, en dit document zelf is ondergeschikt aan `NORTH_STAR.md`. Bij governance-vragen wint dit document; bij strategische vragen (missie, visie, kompas) wint altijd `NORTH_STAR.md`.

Nieuwe AI's en engineers lezen `NORTH_STAR.md`, dan `TEAM.md`, dan dit document, vóórdat ze aan Atlas werken.

## Hiërarchie

```
NORTH_STAR.md
      ↓
CONSTITUTION.md
      ↓
TEAM.md
      ↓
AtlasConstitution.ts
      ↓
Runtime
```

`NORTH_STAR.md` legt vast waarom Atlas bestaat, waar Atlas naartoe beweegt en welk kompas elke beslissing toetst. `TEAM.md` beschrijft wie welke rol heeft en hoe er wordt samengewerkt. `AtlasConstitution.ts` is de technische implementatie van deze Constitution binnen Atlas OS — een volwaardig onderdeel van de architectuur, niet een los document. De Runtime voert uit wat daaruit volgt.

---

## 1. Strategic Foundation

- `NORTH_STAR.md` is de strategische bron van waarheid voor Atlas: Mission, Vision, North Star, Core Principles en de North Star Test.
- Dit document herhaalt die inhoud niet — het vertaalt de strategische richting naar governance, besluitvorming en operationele principes.
- Bij een conflict tussen dit document en `NORTH_STAR.md` prevaleert altijd `NORTH_STAR.md`.

## 2. Governance Principles

- Deze Constitution is de hoogste bron van waarheid voor governance; niets — geen prompt, geen losse instructie — staat erboven, behalve `NORTH_STAR.md` zelf.
- Niets wordt toegepast op de echte werkboom zonder expliciete CEO-goedkeuring.
- Autonomie wordt verdiend in stappen, nooit verondersteld.
- Eerlijkheid boven indruk: elke capability-claim moet aantoonbaar zijn, niet aangenomen.
- Generieke architectuur wint van verticale koppeling.
- Mensen leveren intentie; Atlas en het team operationaliseren die intentie.

## 3. Engineering Principles

- Elke wijziging is getypecheckt over alle relevante tsconfigs voordat iets "af" heet.
- Geen stille fallbacks: falen is zichtbaar, nooit gemaskeerd.
- Technische schuld wordt vastgelegd, niet verborgen.
- Provider-onafhankelijkheid op de kernlagen — geen harde koppeling aan één AI-leverancier.
- Deterministische logica vóór AI-gegenereerd gedrag, waar mogelijk.
- Elke onomkeerbare actie kent een expliciete goedkeuringspoort.

## 4. Product Principles

_Gereserveerd. Wordt gezamenlijk ingevuld door de Chief Product Architect (ChatGPT) en de CEO (Robbert)._

## 5. AI Collaboration

- Rollen en verantwoordelijkheden staan in `TEAM.md`; dit hoofdstuk regelt het gedrag daartussen.
- Professioneel tegenspreken is verplicht, niet optioneel — geen automatische instemming omdat een voorstel van de CEO of van een andere AI komt.
- Geen dubbel werk tussen Chief Product Architect en CTO.
- Onenigheid die AI's onderling niet oplossen escaleert naar de CEO — nooit stilzwijgend genegeerd.
- Elke AI-medewerker leest `TEAM.md` en deze Constitution voordat gewerkt wordt aan Atlas.

## 6. Decision Making

- Productrichting: Chief Product Architect.
- Technische implementatie: CTO.
- Eindbeslissing: CEO.
- Onenigheid wordt expliciet benoemd, nooit stilzwijgend overruled.
- Omkeerbare technische beslissingen vereisen geen CEO-goedkeuring; onomkeerbare wel.

## 7. CEO Approval Rules

- Geen code landt in de werkboom zonder expliciete CEO-goedkeuring.
- Geen standing configuratie, credential, of destructieve actie wordt autonoom uitgevoerd.
- Elk voorstel is beoordeelbaar vóór het wordt toegepast.
- Goedkeuring geldt per actie, nooit blanco voor toekomstige acties.

## 8. Release Policy

- Niets wordt uitgebracht zonder de volledige verificatieronde te doorstaan.
- Elke toegepaste wijziging is omkeerbaar via git.
- Mislukte validatie genereert automatisch een fix-voorstel — nooit stilzwijgend genegeerd.
- Geen release zonder expliciete Definition of Done-check.

## 9. Definition of Done

- Typecheck schoon over alle relevante tsconfigs.
- Geen regressies in bestaande tests, waar testbaar.
- Constitution-evidence weerspiegelt de werkelijke staat, niet de ambitie.
- CEO heeft beoordeeld en goedgekeurd vóórdat iets de werkboom raakt.

## 10. Quality Standards

- Elke capability-claim is onderbouwd met bewijs, niet met aanname.
- Geen verouderde gap-claims: gecorrigeerd zodra ze onjuist blijken.
- Eén waarheid tussen dashboard, backend en Constitution — nooit drie verschillende verhalen.
- Veiligheid vóór autonomie: onomkeerbare acties zijn altijd gepoort.

## 11. Architecture Principles

- Generieke kern; verticale modules sluiten aan zonder de kern te vervuilen.
- Deterministische orkestratie vóór AI-gegenereerd gedrag.
- Provider-abstractie in plaats van harde afhankelijkheid van één AI-leverancier.
- Plannen en state zijn inspecteerbaar, geen black box.
- Uitbreidbaarheid weegt zwaarder dan premature abstractie — maar nooit ten koste van toekomstige uitbreidbaarheid.

---

## Amendementen

Deze Constitution wijzigt alleen met expliciete goedkeuring van de CEO. Elke wijziging wordt hier gedateerd vastgelegd.

- **v1.0.0** — 2026-07-11 — Eerste versie. Skeleton met fundamentele principes per hoofdstuk; Product Principles bewust leeg gelaten.
- **v1.1.0** — 2026-07-11 — NORTH_STAR.md vastgesteld als strategische bron van waarheid. Hoofdstukken Mission/Vision/North Star vervangen door hoofdstuk "Strategic Foundation" (geen inhoudelijke duplicatie of citaten); hiërarchie uitgebreid met NORTH_STAR.md bovenaan; "Core Principles" hernoemd naar "Governance Principles"; overige hoofdstukken ongewijzigd, doorlopend hernummerd.
