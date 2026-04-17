# ImpostosWrapped

Spotify-Wrapped-style React webapp that shows where a Catalan taxpayer's money actually goes.

Enter your gross annual salary, marital status, and number of dependents, and the app walks you through a swipeable story: effective rate, position among Catalan taxpayers, daily contribution, department breakdown, top-5 funded programmes, debt interest, revenue vs spending, per-capita deficit, and a shareable recap card.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (mobile-first, always-mobile viewport)
- Framer Motion (transitions)
- Recharts (donut on the departments screen)
- `html-to-image` + Web Share API (share card)

## Dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

The viewport is capped at 390 px so the experience is always "phone", even on desktop.

## Data sources

All datasets are shipped as JSON in `src/data/`, so the app is fully static:

- `taxBrackets.json` — 2024 IRPF brackets (state + Catalan autonomic), Social Security rates, personal/family minimums
- `budget.json` — Generalitat 2024 budget broken down by department area
- `spending.json` — top-5 specific programmes used for the category screens
- `stats.json` — population, revenue, spending, deficit per capita, outstanding debt
- `comparisons.json` — quirky comparison units (T-usual, menú del dia, camions de 5 €, …)

Numbers were seeded from public sources federated via [opendata.cat](https://opendata.cat/mcp/) — mainly the Generalitat's 2024 budget law (Llei 6/2024) and Idescat income distribution. The `opendata.cat` MCP is a *design-time* helper to locate the right dataset IDs; a React SPA can't call an MCP at runtime, so values are baked in.

## Tax model

`src/lib/tax.ts` implements a simplified Spanish/Catalan employee calculation:

1. Social Security employee contribution (6.35% + 0.7% MEI, capped at base máxima).
2. Earnings reduction (`reducció per rendiments del treball`) on a sliding scale.
3. Personal + family minimum (couple + per-child increments).
4. State brackets + Catalan autonomic brackets applied to the taxable base, minus the bracketed minimum.

Edge cases (pluriempleo, non-work income, regional deductions, split-couple filing) are intentionally out of scope.

## Structure

```
src/
├── App.tsx               # story orchestration
├── components/           # PhoneFrame, StoryProgress, SwipeContainer, AnimatedNumber
├── screens/              # one file per story beat
├── state/WrappedContext  # inputs + derived breakdown
├── lib/                  # tax, compare, format helpers
└── data/                 # all numbers live here
```

## Share

The recap screen renders a black "wrapped" card and exports it with `html-to-image`. On supported browsers it hands the PNG to `navigator.share`; otherwise it triggers a download.
