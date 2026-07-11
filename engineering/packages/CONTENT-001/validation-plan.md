# Validation Plan — CONTENT-001

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **CONTENT-001**
- Title · **Recipe Knowledge Content Wiring**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-08T18:57:01.213Z

## Required commands

```bash
npm run atlas:mission CONTENT-001
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission CONTENT-001
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for CONTENT-001"
- npm run atlas:mission CONTENT-001

## Expected outcome

- Kennis-pagina's voor recepten die al bronmateriaal hebben (introduction/tips/knowledge) tonen dat materiaal echt, in plaats van een lege "draft" pagina — zichtbaar via de Kennis-categorieschermen (Brood/Pizza).
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
