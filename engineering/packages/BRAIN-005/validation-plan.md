# Validation Plan — BRAIN-005

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **BRAIN-005**
- Title · **Capability Registry & Roadmap Intelligence**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-06T22:21:18.035Z

## Required commands

```bash
npm run atlas:mission BRAIN-005
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-005
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for BRAIN-005"
- npm run atlas:mission BRAIN-005

## Expected outcome

- Atlas answers "Where are we weak?", "What should we build next?", and "Why is this the best next step?"
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
