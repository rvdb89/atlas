# Atlas Visual Build Roadmap

**Van:** CTO
**Aan:** CEO
**Status:** Primair stuurinstrument tijdens elke bouwsessie
**Vertaalt:** ATLAS_BUILD_ROADMAP.md (geratificeerd) — geen nieuwe strategie, geen nieuwe fase, geen nieuwe afhankelijkheid. Alleen de bestaande negen fasen opgesplitst in bouwbare sprints, met impact, complexiteit en voortgang.

**Legenda**
Voortgang: ▶ volgende sprint · ⬜ gepland · 🔵 bezig · ✅ voltooid
Impact (hoeveel beter wordt de Atlas-ervaring hierdoor): 🟢 laag · 🟡 gemiddeld · 🔴 hoog
Complexiteit (hoe moeilijk technisch/architectonisch): 🟢 laag · 🟡 gemiddeld · 🔴 hoog

**25 sprints, verdeeld over 9 fasen.**

---

## Governance-amendement — Atlas Experience Track (2026-07-19)

**Vanaf nu is de Atlas Experience Track de primaire bouwvolgorde**, totdat de eerste complete Atlas-ervaring bestaat. Foundation blijft verplicht en loopt parallel — zie het volledige amendement in `ATLAS_BUILD_ROADMAP.md` voor de ratificatie en de precieze redenering.

**Primaire track:** 4.1 → 4.2 → 5.1 → 5.2 → 5.3 *(5.3 wacht op Foundation 3.3)*
**Foundation kritiek pad:** 1.3 → 1.4 → 2.1 → 3.1 → 3.2 → 3.3
**Uitgesteld tot na de eerste complete ervaring:** Sprint 2.2, Sprint 2.3, Fase 6, Fase 7, Fase 8.
**Fase 5-afhankelijkheid gepreciseerd:** "Fase 0 volledig; Fase 1 volledig; Fase 2 — uitsluitend Sprint 2.1; Fase 3 volledig; Fase 4 volledig" (vervangt de eerdere, bredere "Fase 0 t/m 4, volledig").

Legenda hieronder blijft ongewijzigd; sprintstatussen (▶/⬜/🔵/✅) worden per sprint bijgewerkt zoals voorheen, dit amendement herschrijft geen impact-, complexiteit- of Definition of Done-velden.

---

## FASE 0 — Executive Memory

```
════════════════════════════════════════════════════════════════
 FASE 0 · EXECUTIVE MEMORY                        [▶ start morgen]
════════════════════════════════════════════════════════════════
  Sprint 0.1  Executive Memory (opslaglaag)    🟢 Impact  🟡 Complex   ▶
      ↓
  Sprint 0.2  Company State migreert           🟡 Impact  🟢 Complex   ⬜
      ↓
  Sprint 0.3  Memory & Context migreren        🟡 Impact  🟢 Complex   ⬜
════════════════════════════════════════════════════════════════
```

### Sprint 0.1 — Executive Memory (opslaglaag)
**Doel** De persistente, platformonafhankelijke opslaglaag zelf bouwen — het fundament waar elke latere fase op leunt.
**Opleveringen** Een werkende, geteste opslaglaag die bedrijfsstaat en acties bewaart, bereikbaar vanaf zowel web als mobiel, houdbaar over herstarts heen.
**Afhankelijkheden** Geen.
**Impact** 🟢 Laag — op zichzelf verandert de Atlas-ervaring nog niets; er is nog niets dat ervan afhangt.
**Complexiteit** 🟡 Gemiddeld — geen onopgelost probleem, maar wel een fundament dat zorgvuldig moet staan voordat alles erop bouwt.
**Definition of Done** De opslaglaag bewaart en levert data terug op, geverifieerd op zowel web als mobiel, na een herstart.

### Sprint 0.2 — Company State migreert
**Doel** Company State loskoppelen van de huidige browser-localStorage-afhankelijkheid en op Executive Memory laten draaien.
**Opleveringen** Company State zonder web-only beperking; bedrijfsstaat blijft bestaan op elk platform.
**Afhankelijkheden** Sprint 0.1.
**Impact** 🟡 Gemiddeld — nog niet zichtbaar als nieuwe functionaliteit, wel een reëel betrouwbaarheidsprobleem opgelost (data die vandaag stilzwijgend verdwijnt op mobiel).
**Complexiteit** 🟢 Laag — een bestaande, goed afgebakende module krijgt een nieuwe opslagbron; de interface eromheen verandert niet.
**Definition of Done** Company State toont dezelfde data op web en mobiel, ook na herstart.

### Sprint 0.3 — Memory & Context migreren
**Doel** Memory Engine en Context Engine van hun eigen, aparte opslag naar dezelfde Executive Memory-laag brengen.
**Opleveringen** Eén gedeelde geheugenbron voor Company State, Memory Engine en Context Engine — geen losstaande opslag meer.
**Afhankelijkheden** Sprint 0.1.
**Impact** 🟡 Gemiddeld — sluit Fase 0 af en maakt latere toeschrijving (Fase 1) en synthese (Fase 3) pas mogelijk.
**Complexiteit** 🟢 Laag — zelfde migratiepatroon als 0.2, herhaald voor twee bestaande modules.
**Definition of Done** = Fase 0 DoD volledig (zie ATLAS_BUILD_ROADMAP.md): geen losstaande opslag meer, alles overleeft herstart en platformwissel.

---

## FASE 1 — AI Management Team

```
════════════════════════════════════════════════════════════════
 FASE 1 · AI MANAGEMENT TEAM                              [⬜ gepland]
════════════════════════════════════════════════════════════════
  Sprint 1.1  Anna & Yara (hergebruik team)     🟡 Impact  🟢 Complex   ⬜
      ↓
  Sprint 1.2  Tom (Engineering)                 🔴 Impact  🟡 Complex   ⬜
      ↓
  Sprint 1.3  Scout & Jerry (nieuwe rollen)      🟡 Impact  🔴 Complex   ⬜
      ↓
  Sprint 1.4  Organization Model — echte koppeling  🟡 Impact  🟡 Complex   ⬜
════════════════════════════════════════════════════════════════
```

### Sprint 1.1 — Anna & Yara (hergebruik contentteam)
**Doel** Het bestaande content-agentteam (auteur, visueel ontwerp, feitencontrole, validatie) hernoemen en samenvoegen tot de twee herkenbare rollen Anna en Yara, met toeschrijving naar Executive Memory.
**Opleveringen** Anna en Yara als vaste, herkenbare afzenders van al het contentwerk dat vandaag al draait.
**Afhankelijkheden** Sprint 0.3 (toeschrijving heeft een blijvend geheugen nodig).
**Impact** 🟡 Gemiddeld — grotendeels hergebruik, maar het eerste moment waarop "wie deed dit" echt beantwoord kan worden.
**Complexiteit** 🟢 Laag — bestaande, werkende functionaliteit krijgt een naam en een logboek, geen nieuwe logica.
**Definition of Done** Elk stuk contentwerk is in Executive Memory terug te vinden onder Anna of Yara, nooit anoniem.

### Sprint 1.2 — Tom (Engineering)
**Doel** Tom als engineering-identiteit boven op de bestaande Execution/Apply-keten zetten, die vandaag volledig anoniem draait.
**Opleveringen** Tom als vaste, herkenbare afzender van elke code-uitvoering.
**Afhankelijkheden** Sprint 0.3.
**Impact** 🔴 Hoog — dit is letterlijk de rol uit het Jarvis-voorbeeld ("Tom, the developer agent") en sluit de grootste, meest opvallende leemte in het huidige team.
**Complexiteit** 🟡 Gemiddeld — de Execution/Apply-keten zelf verandert niet, er komt een identiteitslaag overheen.
**Definition of Done** Elke toegepaste codewijziging is in Executive Memory terug te vinden onder Tom.

### Sprint 1.3 — Scout & Jerry (nieuwe rollen)
**Doel** Scout formaliseren als zichtbare research/trend-signalering (vandaag alleen impliciet aanwezig als intentieherkenning), en Jerry bouwen als volledig nieuwe klantcontact-capability.
**Opleveringen** Scout als herkenbare bron van marktsignalen; Jerry als eerste werkende klantcontact-functie.
**Afhankelijkheden** Sprint 0.3.
**Impact** 🟡 Gemiddeld — Scout voedt direct de latere Synthese Engine (Fase 3); Jerry is waardevol maar in eerste opzet klein van omvang.
**Complexiteit** 🔴 Hoog — Jerry bestaat vandaag nergens en moet vanaf nul; dit is de enige sprint in Fase 1 zonder bestaande basis om op te bouwen.
**Definition of Done** Scout levert aantoonbare signalen op die niet uit de bestaande intentieherkenning alleen komen; Jerry handelt minimaal één klantcontact-scenario zelfstandig af.

### Sprint 1.4 — Organization Model: echte koppeling
**Doel** De huidige routeringsfictie (wie iets zóu doen) vervangen door een echte koppeling tussen toegewezen werk en daadwerkelijk uitgevoerd werk.
**Opleveringen** Organization Model dat niet alleen werk toewijst, maar ook bevestigt wie het werkelijk heeft afgerond.
**Afhankelijkheden** Sprint 1.1, 1.2, 1.3 — er moeten eerst echte teamleden zijn om aan te koppelen.
**Impact** 🟡 Gemiddeld — onzichtbaar voor de CEO, maar bepaalt of latere toeschrijving in de briefing waar is of verzonnen.
**Complexiteit** 🟡 Gemiddeld.
**Definition of Done** = Fase 1 DoD volledig (zie ATLAS_BUILD_ROADMAP.md): toegewezen werk komt aantoonbaar van hetzelfde teamlid terug, nooit van een ander of ongemarkeerd.

---

## FASE 2 — Risicoclassificatie & Goedkeuringsbeleid

```
════════════════════════════════════════════════════════════════
 FASE 2 · RISICOCLASSIFICATIE & GOEDKEURINGSBELEID        [⬜ gepland]
════════════════════════════════════════════════════════════════
  Sprint 2.1  Goedkeuringsbeleid (risicoregels)  🟡 Impact  🟡 Complex   ⬜ Foundation kritiek pad
      ↓
  Sprint 2.2  CEO Inbox: zichtbaar onderscheid   🔴 Impact  🟢 Complex   ⏸ uitgesteld tot na eerste ervaring
      ↓
  Sprint 2.3  Kwaliteitspoort vóór toepassing    🔴 Impact  🔴 Complex   ⏸ uitgesteld tot na eerste ervaring
════════════════════════════════════════════════════════════════
```
*(Governance-amendement 2026-07-19: Sprint 2.1 is het enige onderdeel van deze fase op het Foundation kritieke pad naar de eerste complete Atlas-ervaring — zie boven. Sprint 2.2 en 2.3 blijven volledig geratificeerd en verplicht, alleen later.)*

### Sprint 2.1 — Goedkeuringsbeleid (risicoregels)
**Doel** Een expliciete risicoclassificatie per actietype vastleggen — vandaag bestaat dit onderscheid nergens.
**Opleveringen** Een compleet beleid dat voor elk actietype bepaalt: laag risico (zelfstandig) of hoog risico (altijd CEO-goedkeuring).
**Afhankelijkheden** Sprint 1.4 (er moeten echte, toegeschreven acties zijn om te classificeren).
**Impact** 🟡 Gemiddeld — nog onzichtbaar totdat 2.2 en 2.3 het beleid daadwerkelijk toepassen.
**Complexiteit** 🟡 Gemiddeld.
**Definition of Done** Elk actietype dat Execution/Apply kent, heeft een vastgestelde classificatie; geen enkel type blijft ongeclassificeerd.

### Sprint 2.2 — CEO Inbox: zichtbaar onderscheid
**Doel** Het beleid uit 2.1 zichtbaar maken: de Inbox toont voortaan expliciet "automatisch uitgevoerd" naast "wacht op jouw besluit", in plaats van alles als "pending".
**Opleveringen** Een vernieuwde CEO Inbox met dat onderscheid, zichtbaar in gebruik.
**Afhankelijkheden** Sprint 2.1.
**Impact** 🔴 Hoog — dit is precies het onderscheid waar de hele North Star-briefing op leunt ("dit heb ik al gedaan" versus "dit vraagt jou").
**Complexiteit** 🟢 Laag — grotendeels statuswerk bovenop een al bestaande Inbox.
**Definition of Done** Beide statussen komen daadwerkelijk voor in de Inbox, herkenbaar zonder uitleg nodig te hebben.
**Status (Governance-amendement 2026-07-19)** Uitgesteld tot na de eerste complete Atlas-ervaring — geen Foundation-afhankelijkheid van Sprint 3.1 e.v.

### Sprint 2.3 — Kwaliteitspoort vóór toepassing
**Doel** De huidige validatie (die ná toepassing draait en niets tegenhoudt) ombouwen tot een harde poort vóór toepassing voor alles wat niet laag risico is.
**Opleveringen** Een Execution/Apply-keten die een falende toets daadwerkelijk kan tegenhouden, in plaats van alleen achteraf te rapporteren.
**Afhankelijkheden** Sprint 2.1.
**Impact** 🔴 Hoog — een reëel kwaliteits- en vertrouwensrisico wordt weggenomen; noodzakelijk voordat autonomie kan toenemen.
**Complexiteit** 🔴 Hoog — het herordenen van een bestaande, werkende keten zonder de huidige, functionerende stroom te breken is het lastigste onderdeel van deze fase.
**Definition of Done** = Fase 2 DoD volledig (zie ATLAS_BUILD_ROADMAP.md): geen hoog-risico-actie wordt ooit toegepast zonder voorafgaande goedkeuring, en een falende toets voorkomt aantoonbaar toepassing.
**Status (Governance-amendement 2026-07-19)** Uitgesteld tot na de eerste complete Atlas-ervaring — geen Foundation-afhankelijkheid van Sprint 3.1 e.v.

---

## FASE 3 — Synthese Engine

```
════════════════════════════════════════════════════════════════
 FASE 3 · SYNTHESE ENGINE                                 [⬜ gepland]
════════════════════════════════════════════════════════════════
  Sprint 3.1  Decision Engine: cross-domein     🟡 Impact  🟡 Complex   ⬜
      ↓
  Sprint 3.2  Synthese Engine (nieuw)            🔴 Impact  🔴 Complex   ⬜
      ↓
  Sprint 3.3  CockpitOpening vervangen           🟡 Impact  🟢 Complex   ⬜
════════════════════════════════════════════════════════════════
```

### Sprint 3.1 — Decision Engine: cross-domein
**Doel** De huidige, engineering-only waardescore van de Decision Engine uitbreiden zodat content, research, kwaliteit en klantcontact op dezelfde schaal meewegen.
**Opleveringen** Eén prioriteitsschaal die de volle breedte van de onderneming dekt, niet alleen de roadmap.
**Afhankelijkheden** Sprint 1.4 (echt, toegeschreven werk over alle domeinen), Sprint 2.1 (risico moet meewegen in prioriteit).
**Impact** 🟡 Gemiddeld — enablend, nog niet zelf de briefing.
**Complexiteit** 🟡 Gemiddeld — uitbreiding van bestaande, werkende scoringslogica, geen nieuw fundament.
**Definition of Done** Dezelfde schaal produceert vergelijkbare scores voor minstens twee verschillende domeinen (bijv. engineering én content) in één run.

### Sprint 3.2 — Synthese Engine (nieuw)
**Doel** De nieuwe laag bouwen die uit de cross-domein scores een beperkte, gerangschikte selectie haalt én een verhaalvolgorde bepaalt — de spil van de hele North Star.
**Opleveringen** Een werkende Synthese Engine die van alle input een klein, gerangschikt geheel maakt in plaats van een platte lijst.
**Afhankelijkheden** Sprint 3.1.
**Impact** 🔴 Hoog — dit is het hart van de North Star-ervaring; zonder deze sprint blijft alles losse departementale updates.
**Complexiteit** 🔴 Hoog — de meest nieuwe, meest architectonisch onbeproefde bouwsteen in de hele roadmap.
**Definition of Done** Voor een gegeven periode levert de engine een beperkte selectie op, en diezelfde gebeurtenissen leiden aantoonbaar tot een andere selectie zodra hun belang verschilt.

### Sprint 3.3 — CockpitOpening vervangen
**Doel** De huidige, smalle, hardgecodeerde briefing-sjablonen loskoppelen en vervangen door de Synthese Engine als enige bron.
**Opleveringen** Eén briefing-pad, geen twee naast elkaar.
**Afhankelijkheden** Sprint 3.2.
**Impact** 🟡 Gemiddeld — maakt 3.2 pas daadwerkelijk bruikbaar voor de CEO, zonder zelf nieuwe logica toe te voegen.
**Complexiteit** 🟢 Laag — vooral opruimen en ombouwen van bestaande aanroepen.
**Definition of Done** = Fase 3 DoD volledig (zie ATLAS_BUILD_ROADMAP.md): geen apart, hardgecodeerd briefing-pad meer naast de Synthese Engine.

---

## FASE 4 — Eén CEO-oppervlak (The Room v1)

```
════════════════════════════════════════════════════════════════
 FASE 4 · ÉÉN CEO-OPPERVLAK (THE ROOM V1)     [▶ Experience Track — primair]
════════════════════════════════════════════════════════════════
  Sprint 4.1  Architectuurbeslissing & fundament  🟡 Impact  🟡 Complex   ▶
      ↓
  Sprint 4.2  Functionaliteit migreren           🔴 Impact  🔴 Complex   ⬜
════════════════════════════════════════════════════════════════
```
*(Governance-amendement 2026-07-19: Fase 4 en 5 vormen samen de Atlas Experience Track — zie boven. Sprint 4.1 is de huidige sprint.)*

### Sprint 4.1 — Architectuurbeslissing & fundament
**Doel** Expliciet vastleggen dat The Room het enige CEO-facing oppervlak wordt, en de eerste structurele stap zetten om Atlas Control's bruikbare onderdelen daarin onder te brengen.
**Opleveringen** Een vastgelegde, ondubbelzinnige beslissing plus het technische fundament om functionaliteit te laten verhuizen.
**Afhankelijkheden** Geen — dit is een architectuurbeslissing, geen databeslissing. Kan parallel aan Fase 0-3 starten.
**Impact** 🟡 Gemiddeld — de beslissing zelf is nog niet voelbaar voor de CEO.
**Complexiteit** 🟡 Gemiddeld — vooral ontwerpwerk: bepalen wat blijft, wat verhuist, wat vervalt.
**Definition of Done** Er is één vastgelegde beslissing over het doeloppervlak, met een concreet migratiepad voor elk onderdeel van Atlas Control.

### Sprint 4.2 — Functionaliteit migreren
**Doel** CEO Inbox, teamoverzicht en de overige bruikbare onderdelen van Atlas Control daadwerkelijk naar The Room verhuizen.
**Opleveringen** The Room v1 met alle functionaliteit die voorheen alleen in Atlas Control bestond.
**Afhankelijkheden** Sprint 4.1.
**Impact** 🔴 Hoog — dit is het moment waarop er voor het eerst echt maar één plek is waar de CEO Atlas ontmoet.
**Complexiteit** 🔴 Hoog — reële migratie tussen twee codebases die vandaag niets delen.
**Definition of Done** = Fase 4 DoD volledig (zie ATLAS_BUILD_ROADMAP.md): geen scenario meer waarin de CEO een andere versie van de bedrijfsstaat ziet, afhankelijk van welk oppervlak wordt geopend.

*Waarom gesplitst in twee in plaats van één: de beslissing wélk oppervlak wint heeft gevolgen voor alles wat daarna gebouwd wordt (inclusief Fase 5). Die beslissing verdient een eigen, aanwijsbaar moment — niet omdat het twee keer zoveel werk is, maar omdat het een apart, omkeerbaar controlemoment verdient vóór de onomkeerbare migratie begint.*

---

## FASE 5 — CEO Briefing

```
════════════════════════════════════════════════════════════════
 FASE 5 · CEO BRIEFING                        [⬜ Experience Track — primair]
════════════════════════════════════════════════════════════════
  Sprint 5.1  Rendering Law: verhalende modus   🟢 Impact  🟡 Complex   ⬜
      ↓
  Sprint 5.2  Afspeel-sequentie bouwen           🟡 Impact  🔴 Complex   ⬜
      ↓
  Sprint 5.3  Koppelen aan Synthese Engine       🔴 Impact  🟡 Complex   ⬜ wacht op Foundation 3.3
════════════════════════════════════════════════════════════════
```

### Sprint 5.1 — Rendering Law: verhalende modus
**Doel** De regels voor hoe The Room mag bewegen en verschijnen uitbreiden met een sequentiële, verhalende modus, naast de bestaande statische reveal-regels.
**Opleveringen** Vastgelegde regels voor "punt verschijnt, pauze, visualisatie, verdwijnt" als geratificeerd gedrag.
**Afhankelijkheden** Sprint 4.2 (The Room v1 moet het doeloppervlak zijn).
**Impact** 🟢 Laag — regels alleen, nog geen ervaring.
**Complexiteit** 🟡 Gemiddeld.
**Definition of Done** De nieuwe modus is vastgelegd naast de bestaande regels, zonder de bestaande statische reveal-regels te breken.

### Sprint 5.2 — Afspeel-sequentie bouwen
**Doel** De daadwerkelijke afspeelmechaniek in The Room bouwen: één punt tegelijk, met een moment van verschijnen en verdwijnen.
**Opleveringen** Een werkende sequentie-engine in The Room, nog met willekeurige of testinhoud.
**Afhankelijkheden** Sprint 5.1.
**Impact** 🟡 Gemiddeld — voelbaar als techniekdemonstratie, nog niet als echte briefing.
**Complexiteit** 🔴 Hoog — de meest nieuwe UI-mechaniek in de hele roadmap; hier wordt de sfeer van "A Day in the Life" voor het eerst technisch echt.
**Definition of Done** Minimaal twee tot drie punten verschijnen na elkaar, elk met een zichtbaar moment van verschijnen en verdwijnen.

### Sprint 5.3 — Koppelen aan Synthese Engine
**Doel** De afspeel-sequentie daadwerkelijk laten spreken vanuit de Synthese Engine (Fase 3) in plaats van losstaand te functioneren.
**Opleveringen** Een briefing die echte, actuele inhoud toont — de eerste keer dat de volledige North Star-ervaring werkt.
**Afhankelijkheden** Sprint 5.2, Sprint 3.3.
**Impact** 🔴 Hoog — dit is het moment waarop "Atlas geeft een natuurlijke briefing" voor het eerst echt waar is.
**Complexiteit** 🟡 Gemiddeld — vooral integratie van twee al bestaande, af geronde systemen.
**Definition of Done** = Fase 5 DoD volledig (zie ATLAS_BUILD_ROADMAP.md): de briefing komt aantoonbaar uit de Synthese Engine, eindigt met een concrete aanbeveling wanneer die er is, en Heart/stage/architectuur blijven ongemoeid.

---

## FASE 6 — Atlas' Werkdagritme

```
════════════════════════════════════════════════════════════════
 FASE 6 · ATLAS' WERKDAGRITME                             [⬜ gepland]
════════════════════════════════════════════════════════════════
  Sprint 6.1  Dagfasering ontwerpen en bouwen   🟡 Impact  🔴 Complex   ⬜
      ↓
  Sprint 6.2  Oude runtime-lus uitfaseren        🔴 Impact  🟡 Complex   ⬜
════════════════════════════════════════════════════════════════
```

### Sprint 6.1 — Dagfasering ontwerpen en bouwen
**Doel** De planningslaag bouwen die de vijf teamleden op logische momenten activeert, in plaats van willekeurig één missie per vijf minuten.
**Opleveringen** Een werkende, meersporige planning die naast de bestaande lus kan draaien.
**Afhankelijkheden** Fase 1 t/m 5 volledig (er moet al een team, beleid, synthese en briefing-oppervlak bestaan).
**Impact** 🟡 Gemiddeld — het mechanisme bestaat, maar is nog niet het primaire proces.
**Complexiteit** 🔴 Hoog — meersporige planning over een echt team is architectonisch het lastigste onderdeel na de Synthese Engine zelf.
**Definition of Done** De planning activeert aantoonbaar meerdere teamleden op verschillende, logische momenten binnen één dag.

### Sprint 6.2 — Oude runtime-lus uitfaseren
**Doel** De huidige vaste vijf-minuten-enkelvoudige-missielus veilig vervangen door de nieuwe dagfasering, zonder regressie op wat al werkte.
**Opleveringen** Eén planningsmechanisme, niet twee naast elkaar.
**Afhankelijkheden** Sprint 6.1.
**Impact** 🔴 Hoog — dit is het moment waarop Atlas echt proactief wordt in plaats van reactief; de CEO hoeft nergens meer naar te vragen.
**Complexiteit** 🟡 Gemiddeld — vooral zorgvuldige cutover, geen nieuwe logica.
**Definition of Done** = Fase 6 DoD volledig (zie ATLAS_BUILD_ROADMAP.md): een CEO die een dag wegblijft, treft bij terugkomst een briefing aan met meer dan één moment van activiteit; de oude lus bestaat niet meer als enige mechanisme.

---

## FASE 7 — Externe Databronnen *(parallel spoor, geen vaste volgorde)*

```
════════════════════════════════════════════════════════════════
 FASE 7 · EXTERNE DATABRONNEN                [⬜ gepland · parallel, CEO-toegang bepaalt volgorde]
════════════════════════════════════════════════════════════════
  Sprint 7.1  Omzet & downloads                  🔴 Impact  🟡 Complex   ⬜
  Sprint 7.2  Advertenties & ROAS                🟡 Impact  🟡 Complex   ⬜
  Sprint 7.3  Content-/social-weergaven           🟡 Impact  🟡 Complex   ⬜
  (geen onderlinge afhankelijkheid — volgorde bepaald door welke toegang de CEO als eerste verleent)
════════════════════════════════════════════════════════════════
```

### Sprint 7.1 — Omzet & downloads
**Doel** Stripe/RevenueCat en App Store Connect/Play Console koppelen aan Company State en de Synthese Engine.
**Opleveringen** Echte omzet- en downloadcijfers in de briefing.
**Afhankelijkheden** Sprint 3.2 (Synthese Engine moet al bestaan), CEO-toegang tot deze accounts.
**Impact** 🔴 Hoog — de meest fundamentele "hoe gaat het bedrijf"-vraag, exact zoals in de Jarvis-video geopend wordt.
**Complexiteit** 🟡 Gemiddeld — scoped, bekende API's; geen architectonisch nieuw terrein.
**Definition of Done** Het getoonde cijfer komt aantoonbaar overeen met het echte account; ontbrekende toegang leidt tot een expliciete melding, nooit een verzonnen cijfer.

### Sprint 7.2 — Advertenties & ROAS
**Doel** Meta/TikTok/Google Ads koppelen.
**Opleveringen** Echte advertentie-uitgave en rendement in de briefing.
**Afhankelijkheden** Sprint 3.2, CEO-toegang tot deze accounts.
**Impact** 🟡 Gemiddeld.
**Complexiteit** 🟡 Gemiddeld.
**Definition of Done** Zelfde criterium als 7.1, toegepast op advertentiedata.

### Sprint 7.3 — Content-/social-weergaven
**Doel** Instagram-, TikTok- en YouTube-analytics koppelen.
**Opleveringen** Echte bereikcijfers in de briefing.
**Afhankelijkheden** Sprint 3.2, CEO-toegang tot deze accounts.
**Impact** 🟡 Gemiddeld.
**Complexiteit** 🟡 Gemiddeld.
**Definition of Done** Zelfde criterium als 7.1, toegepast op contentweergaven.
= Fase 7 DoD is per aangesloten bron te behalen (zie ATLAS_BUILD_ROADMAP.md); de fase als geheel is nooit "af", ze groeit met elke nieuw verleende toegang.

---

## FASE 8 — Voice Interface *(parallel spoor)*

```
════════════════════════════════════════════════════════════════
 FASE 8 · VOICE INTERFACE                    [⬜ gepland · na Fase 5, parallel aan 6-7]
════════════════════════════════════════════════════════════════
  Sprint 8.1  Text-to-speech (Atlas spreekt)    🔴 Impact  🟡 Complex   ⬜
      ↓
  Sprint 8.2  Speech-to-text (CEO bevraagt)      🟡 Impact  🔴 Complex   ⬜
════════════════════════════════════════════════════════════════
```

### Sprint 8.1 — Text-to-speech (Atlas spreekt)
**Doel** De bestaande, al werkende CEO Briefing hoorbaar maken.
**Opleveringen** Een audiokanaal naast het bestaande visuele kanaal.
**Afhankelijkheden** Sprint 5.3 (er moet een echte briefing zijn om uit te spreken).
**Impact** 🔴 Hoog — het meest herkenbare "Jarvis"-kenmerk uit de video.
**Complexiteit** 🟡 Gemiddeld — spraaksynthese is een goed opgelost probleem om te integreren.
**Definition of Done** De volledige briefing is te ontvangen via audio, zonder te hoeven lezen.

### Sprint 8.2 — Speech-to-text (CEO bevraagt)
**Doel** De CEO laten terugpraten en vragen stellen tijdens of na de briefing.
**Opleveringen** Een gesproken vraag-en-antwoordkanaal.
**Afhankelijkheden** Sprint 8.1.
**Impact** 🟡 Gemiddeld — waardevol, maar secundair; tekst/visueel dekt de kern al.
**Complexiteit** 🔴 Hoog — spraakherkenning plus intentieverwerking plus vervolgvragen is het lastigste stuk van deze fase.
**Definition of Done** = Fase 8 DoD volledig (zie ATLAS_BUILD_ROADMAP.md): een gesproken vraag krijgt een gesproken antwoord dat overeenkomt met de tekstuele/visuele briefing; uitval van spraak laat tekst/visueel ongemoeid.

---

## Volledig overzicht — alle 25 sprints

| # | Fase | Sprint | Impact | Complex. | Afhankelijk van | Status |
|---|---|---|---|---|---|---|
| 1 | 0 | Executive Memory (opslaglaag) | 🟢 | 🟡 | — | ▶ volgende |
| 2 | 0 | Company State migreert | 🟡 | 🟢 | 0.1 | ⬜ |
| 3 | 0 | Memory & Context migreren | 🟡 | 🟢 | 0.1 | ⬜ |
| 4 | 1 | Anna & Yara (hergebruik) | 🟡 | 🟢 | 0.3 | ⬜ |
| 5 | 1 | Tom (Engineering) | 🔴 | 🟡 | 0.3 | ⬜ |
| 6 | 1 | Scout & Jerry (nieuw) | 🟡 | 🔴 | 0.3 | ⬜ |
| 7 | 1 | Organization Model — koppeling | 🟡 | 🟡 | 1.1, 1.2, 1.3 | ⬜ |
| 8 | 2 | Goedkeuringsbeleid | 🟡 | 🟡 | 1.4 | ⬜ Foundation kritiek pad |
| 9 | 2 | CEO Inbox — onderscheid | 🔴 | 🟢 | 2.1 | ⏸ uitgesteld tot na eerste ervaring |
| 10 | 2 | Kwaliteitspoort vóór toepassing | 🔴 | 🔴 | 2.1 | ⏸ uitgesteld tot na eerste ervaring |
| 11 | 3 | Decision Engine — cross-domein | 🟡 | 🟡 | 1.4, 2.1 | ⬜ Foundation kritiek pad |
| 12 | 3 | Synthese Engine (nieuw) | 🔴 | 🔴 | 3.1 | ⬜ Foundation kritiek pad |
| 13 | 3 | CockpitOpening vervangen | 🟡 | 🟢 | 3.2 | ⬜ Foundation kritiek pad |
| 14 | 4 | Architectuurbeslissing & fundament | 🟡 | 🟡 | — (parallel) | ▶ Experience Track — huidige sprint |
| 15 | 4 | Functionaliteit migreren | 🔴 | 🔴 | 4.1 | ⬜ |
| 16 | 5 | Rendering Law — verhalende modus | 🟢 | 🟡 | 4.2 | ⬜ |
| 17 | 5 | Afspeel-sequentie bouwen | 🟡 | 🔴 | 5.1 | ⬜ |
| 18 | 5 | Koppelen aan Synthese Engine | 🔴 | 🟡 | 5.2, 3.3 | ⬜ |
| 19 | 6 | Dagfasering ontwerpen en bouwen | 🟡 | 🔴 | Fase 1-5 | ⬜ |
| 20 | 6 | Oude runtime-lus uitfaseren | 🔴 | 🟡 | 6.1 | ⬜ |
| 21 | 7 | Omzet & downloads | 🔴 | 🟡 | 3.2 + CEO-toegang | ⬜ |
| 22 | 7 | Advertenties & ROAS | 🟡 | 🟡 | 3.2 + CEO-toegang | ⬜ |
| 23 | 7 | Content-/social-weergaven | 🟡 | 🟡 | 3.2 + CEO-toegang | ⬜ |
| 24 | 8 | Text-to-speech | 🔴 | 🟡 | 5.3 | ⬜ |
| 25 | 8 | Speech-to-text | 🟡 | 🔴 | 8.1 | ⬜ |

---

## De volledige route in één oogopslag

```
FASE 0 ███ (3 sprints — fundament)
   ↓
FASE 1 ████ (4 sprints — het team)
   ↓
FASE 2 ███ (3 sprints — grenzen & vertrouwen)
   ↓
FASE 3 ███ (3 sprints — de spil: Synthese Engine)
   ↓
FASE 4 ██ (2 sprints — kan parallel aan 0-3 starten)
   ↓
FASE 5 ███ (3 sprints — de eerste echte briefing) ◄── North Star zichtbaar
   ↓
FASE 6 ██ (2 sprints — proactief in plaats van reactief)
   ↓
FASE 7 ███ (3 sprints — parallel spoor, na Fase 3, CEO-toegang bepaalt tempo)
FASE 8 ██  (2 sprints — parallel spoor, na Fase 5)
```

---

## Wat dit betekent, concreet

- **Morgen beginnen we met:** Sprint 0.1 — Executive Memory (opslaglaag).
- **Daarna komt:** Sprint 0.2 — Company State migreert.
- **Totale omvang:** 25 sprints over 9 fasen. Fase 0 t/m 6 is de kernroute (20 sprints); Fase 7 en 8 zijn parallelle sporen (5 sprints) die niet blokkeren en op elk moment na hun startpunt kunnen beginnen zodra er capaciteit of externe toegang is.
- **Hoogste impact** (🔴): Tom (1.2), CEO Inbox-onderscheid (2.2), Kwaliteitspoort (2.3), Synthese Engine (3.2), Functionaliteit migreren (4.2), Koppelen aan Synthese Engine (5.3), Oude runtime-lus uitfaseren (6.2), Omzet & downloads (7.1), Text-to-speech (8.1). Negen sprints die het meest bepalen hoe goed Atlas aanvoelt.
- **Hoogste complexiteit** (🔴): Scout & Jerry (1.3), Kwaliteitspoort (2.3), Synthese Engine (3.2), Functionaliteit migreren (4.2), Afspeel-sequentie bouwen (5.2), Dagfasering (6.1), Speech-to-text (8.2). Zeven sprints die het meeste technisch risico dragen — geen ervan valt toevallig samen met de hoogste-impact-lijst, op de Synthese Engine en Functionaliteit migreren na. Dat zijn de twee sprints die zowel de meeste waarde als het meeste risico dragen, en dus de meeste aandacht verdienen wanneer ze aan de beurt zijn.

---

## Bouwvolgorde-check tegen de geratificeerde Build Roadmap

De sprintvolgorde volgt exact de fase-afhankelijkheden uit ATLAS_BUILD_ROADMAP.md — geen enkele sprint doorbreekt een afhankelijkheid die daar is vastgelegd. Twee plekken waar ik een fase verder heb opgesplitst dan het minimum, met reden:

**Fase 1 in vier sprints in plaats van één.** De Build Roadmap noemt vijf teamleden en één koppelmechanisme als geheel. Dat in één sprint proppen zou een "kunstmatig grote" sprint zijn zonder tussentijdse waarde. De opsplitsing volgt een echte volgorde: eerst hergebruik (laag risico, snel), dan de hoogste-impact-toevoeging (Tom), dan de twee volledig nieuwe rollen (hoogste risico), dan pas de koppeling die alles bindt — elke stap levert zelfstandig iets op.

**Fase 4 in twee sprints in plaats van één.** Dit is een architectuurbeslissing met gevolgen voor alles wat erna komt (met name Fase 5). Die beslissing verdient een eigen, aanwijsbaar controlemoment vóórdat de — grotere en risicovollere — daadwerkelijke migratie begint, niet omdat het toevallig twee keer zoveel werk is.

Alle overige fasen zijn opgesplitst volgens hun natuurlijke bouwvolgorde zoals die al in de Build Roadmap besloten lag (regels vóór mechaniek vóór koppeling; beleid vóór zichtbaar gevolg vóór afdwinging) — geen van die sprints is kunstmatig toegevoegd; elke sprint levert zelfstandig een afgerond, bruikbaar resultaat op, zoals gevraagd.
