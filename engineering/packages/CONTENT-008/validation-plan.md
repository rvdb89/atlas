# Validation Plan — CONTENT-008

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **CONTENT-008**
- Title · **Overgeslagen artikel Kamertemperatuur alsnog schrijven**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T19:19:31.008Z

## Required commands

```bash
npm run atlas:mission CONTENT-008
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission CONTENT-008
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for CONTENT-008"
- npm run atlas:mission CONTENT-008

## Expected outcome

- Het kamertemperatuur-artikel toont echte, leesbare content in de Kennisbibliotheek (categorie temperaturen) in plaats van een lege pagina, geschreven door de echte agent-ploeg.
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
