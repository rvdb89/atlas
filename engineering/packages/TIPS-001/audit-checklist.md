# Audit Checklist — TIPS-001

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **TIPS-001**
- Title · **Tips uitbreiden — 14 nieuwe baktips**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:11:35.458Z

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
- [ ] npm run atlas:mission TIPS-001 regenerates package

## Mission-specific checks

- [ ] Tips uitbreiden — 14 nieuwe baktips module exists under src/atlas/
- [ ] scripts/atlas/tipsGenerationEngine.ts (nieuw — TIP_MISSIONS["TIPS-001"], runTipsGenerationEngine) implemented per mission scope
- [ ] src/atlas/ai/types/index.ts (nieuw taaktype "tips.write" toegevoegd aan AtlasTaskType) implemented per mission scope
- [ ] src/atlas/ai/tasks/routes.ts (route voor tips.write — copywriter, klein maxTokens-budget, geen zware pipeline) implemented per mission scope
- [ ] src/atlas/ai/providers/provider-config.ts (TASK_PROVIDER_CONFIG + CLAUDE_LIVE_TASKS-entry voor tips.write — dit is de tabel die daadwerkelijk wordt toegepast, niet routes.ts alleen, zie de knowledge.write-toelichting in hetzelfde bestand) implemented per mission scope
- [ ] src/atlas/ai/providers/ClaudeProvider.ts (tips.write toegevoegd aan de live-Claude-taken van de echte provider) implemented per mission scope
- [ ] src/atlas/ai/prompts/tips/index.ts (nieuw — tips.write.v1 prompt, gericht op één zin, 40-160 tekens, geen herhaling van bestaande tips) implemented per mission scope
- [ ] src/atlas/ai/prompts/library.ts (registreert TIPS_PROMPTS + tips.write in TASK_PROMPT_IDS) implemented per mission scope
- [ ] src/modules/doughbert/tips/tips.ts (doelbestand — alleen aanvullen, nooit bestaande tips overschrijven) implemented per mission scope
- [ ] scripts/atlas-runtime.ts (dispatch: isTipsMission(missionId) routeert naar runTipsGenerationEngine, naast de bestaande content- en generieke-executie-branch) implemented per mission scope
- [ ] Constraint respected: De bestaande 31 tips in tips.ts worden woordelijk bewaard — deterministische serialisatie, geen AI-herschrijving van het hele bestand
- [ ] Constraint respected: Nieuwe tips die inhoudelijk overlappen met een bestaande tip (exacte of bijna-exacte tekst) worden stil overgeslagen, niet toegevoegd als duplicaat
- [ ] Constraint respected: Eén gebundelde AI-aanroep per categorie (niet per tip) om het aantal aanroepen laag te houden
- [ ] Constraint respected: Draait via dezelfde CEO Inbox/Apply Engine-flow als elke andere missie — geen enkele tip wordt automatisch toegepast zonder goedkeuring
- [ ] Constraint respected: Wordt niet meteen getriggerd zolang CONTENT-010 nog in de wachtrij/uitvoering staat — deze missie staat klaar voor de eerstvolgende vrije cyclus, niet gedwongen ertussendoor
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission TIPS-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] 14 nieuwe, unieke, publiceerbare tips liggen klaar als reviewbaar voorstel in de CEO Inbox, verdeeld over alle 7 bestaande categorieën, zonder dat er ook maar één bestaande tip is aangeraakt.

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
