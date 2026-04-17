# ImpostosWrapped — Plan

A Spotify-Wrapped-style React webapp that shows a Catalan taxpayer where their money goes. Always-mobile viewport, swipeable/tappable story, with data sourced from opendata.cat.

## Stack

- **Vite + React + TypeScript** — fast dev, tiny footprint
- **Tailwind CSS** — mobile-first styling, quick gradient/typography work
- **Framer Motion** — screen transitions + story progress animation
- **Recharts** — donut + bar graphs on screens 2, 3, 5
- **No backend** — calculations run client-side; datasets baked into `src/data/`

Deployment: static, any host (Vercel / GH Pages).

## MCP integration strategy

The `opendata.cat` MCP is a *design-time* tool for Claude — a React SPA can't call an MCP directly at runtime. The plan:

1. A Node script `scripts/fetch-data.ts` pulls the canonical datasets we need from the portals that opendata.cat federates (Generalitat budget CKAN, Idescat, Agència Tributària). I will use the opendata.cat MCP during implementation to locate the correct dataset IDs, then the script downloads the underlying CSV/JSON directly so the webapp keeps working offline.
2. Results are written to `src/data/*.json` and imported by screens.
3. Datasets:
   - `budget.json` — Generalitat 2024 spending per department (Salut, Educació, Drets Socials, Interior, Cultura, Interessos del deute, etc.)
   - `spending.json` — granular sub-categories for the "biggest contribution" screens (hospitals, schools, Mossos, TMB, sequera, R+D, …)
   - `taxBrackets.json` — IRPF state + Catalan autonomic brackets (2024)
   - `stats.json` — population, total revenue, total spending, deficit, per-capita deficit
   - `comparisons.json` — quirky comparison units ("1 mes de lloguer a BCN = 1.100 €", "1 menú = 14 €", "1 bitllet T-usual = 42,35 €")

## Tax engine — `src/lib/tax.ts`

Inputs: `grossAnnual`, `status: 'single' | 'couple'`, `dependents: number`.

Pipeline:
1. **Social Security (employee)** ≈ 6.47 % of gross (simplified, capped at base máxima).
2. **Taxable base** = gross − SS − reducció per rendiments del treball (2.000 € + extra si salari baix).
3. **Personal & family minimum** = 5.550 € + increments per parella + per fills (2.400 € 1r, 2.700 € 2n, 4.000 € 3r…).
4. **IRPF** = apply state brackets + Catalan autonomic brackets to taxable base; subtract bracketed minimums.
5. Returns `{ socialSecurity, incomeTax, totalTax, netAnnual, effectiveRate }` and a department-weighted allocation of `incomeTax` using `budget.json`.

All percentages/brackets live in JSON so they can be updated without code changes.

## UX — mobile-only phone frame

- `PhoneFrame.tsx` caps viewport at **max-width 430 px**, centered, with device bezel styling on wider screens. Body has `overflow:hidden`.
- `SwipeContainer.tsx` handles:
  - tap on right 1/3 of screen → next
  - tap on left 1/3 → previous
  - horizontal swipe (Framer Motion `drag="x"`) with snap + threshold
  - long-press pauses the auto-progress
- `StoryProgress.tsx` shows one segment per screen at the top, like Instagram Stories. Active segment fills over ~6 s (auto-advance); tapping a segment jumps there.
- Each screen uses a vivid gradient background + big sans-serif headline + animated numbers.

## Screens (in order)

0. **Intro** — "ImpostosWrapped 2024" splash + CTA *Comença*.
1. **Input** — three fields: gross salary, status (toggle), dependents (stepper). Submit → computes.
2. **Contribution disclosure** — four animated numbers:
   - Payroll contribution (gross-to-net deductions)
   - Social contribution (SS employee)
   - Income tax (IRPF)
   - Effective rate (%) as hero number
3. **Position among Catalan taxpayers** — tier (*Bottom / Middle / Top 10 %*) from Idescat income distribution; horizontal bar graph placing the user on the curve.
4. **Everyday contribution** — "Cada dia pagues X €" / "cada mes Y €" / "cada hora de feina, Z €".
5. **Department split** — donut chart from `budget.json`: Salut, Educació, Drets Socials, Interior, Cultura, Interessos, altres.
6-10. **Top-5 specific contributions** (one per screen, biggest → smallest):
   - Hospitals públics
   - Escoles i instituts
   - Pensions / dependència
   - Mossos d'Esquadra
   - Transport públic (FGC/TMB/Rodalies)
   Each screen shows: €/any to that program, % of total contribution, and a fun comparison ("això són 2 camions de 5 € en efectiu" / "X menús del dia" / "Y mesos de lloguer").
11. **Interest on debt** — closes the contribution section; introduces the revenue-vs-spending story.
12. **Revenue vs spending** — two stacked bars: state income vs state outflow; highlights the gap.
13. **Deficit per capita** — "el dèficit per català és de X €/any" with a big number.
14. **Recap** — carousel of the funniest stats ("Has pagat l'equivalent a N camions de diners", "has finançat K llits d'hospital durant una hora"), ending with a **Share** button that generates a PNG of the card via `html-to-image` and uses Web Share API (fallback: download).

## File layout

```
/
├── PLAN.md                      (this file)
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── scripts/
│   └── fetch-data.ts            # one-shot: pulls opendata.cat → src/data/*.json
└── src/
    ├── main.tsx
    ├── App.tsx                  # mounts PhoneFrame + Wrapped
    ├── index.css                # Tailwind + globals
    ├── data/
    │   ├── budget.json
    │   ├── spending.json
    │   ├── taxBrackets.json
    │   ├── stats.json
    │   └── comparisons.json
    ├── lib/
    │   ├── tax.ts               # IRPF + SS calculation
    │   ├── compare.ts           # turn € amounts into funny units
    │   └── format.ts            # €, %, animated-counter helpers
    ├── state/
    │   └── WrappedContext.tsx   # inputs + derived breakdown
    ├── components/
    │   ├── PhoneFrame.tsx
    │   ├── StoryProgress.tsx
    │   ├── SwipeContainer.tsx
    │   ├── AnimatedNumber.tsx
    │   ├── ShareCard.tsx
    │   └── charts/
    │       ├── DonutChart.tsx
    │       └── PositionBar.tsx
    └── screens/
        ├── IntroScreen.tsx
        ├── InputScreen.tsx
        ├── ContributionScreen.tsx
        ├── PositionScreen.tsx
        ├── EverydayScreen.tsx
        ├── DepartmentsScreen.tsx
        ├── CategoryScreen.tsx   # reused ×5 with props
        ├── InterestScreen.tsx
        ├── RevenueVsSpendScreen.tsx
        ├── DeficitScreen.tsx
        └── RecapScreen.tsx
```

## Implementation order

1. Scaffold Vite+React+TS, Tailwind, Framer Motion, Recharts.
2. `PhoneFrame`, `StoryProgress`, `SwipeContainer` + routing between screens.
3. `scripts/fetch-data.ts` + commit baseline JSON (hand-seeded from the opendata.cat MCP results so the app runs even if the script isn't rerun).
4. `tax.ts` + `WrappedContext`.
5. Screens 0→1 (intro + input form).
6. Screens 2→4 (contribution / position / everyday).
7. Screen 5 (departments donut) + 5× CategoryScreen.
8. Screens 11→13 (interest, revenue vs spend, deficit).
9. Screen 14 (recap + share via Web Share API + html-to-image).
10. Copy polish (Catalan strings), gradient/typography pass, animated counters.
11. `npm run build` sanity check + `README.md` with how to run + how to refresh data.

## Open questions (can answer myself with reasonable defaults, flag if you disagree)

- **Language**: default to **Catalan** copy with playful tone. Happy to add an ES/EN toggle later.
- **Year**: **2024** budget figures (latest closed exercise).
- **Couple taxation**: simplified — "couple" = joint declaration (*tributació conjunta*) with the reduction; no per-partner salary split.
- **Share output**: static PNG of the recap card + Web Share API.
