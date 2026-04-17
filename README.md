# ImpostosWrapped

A Spotify-Wrapped-style React web app that shows a Catalan taxpayer **where their money actually goes**. Enter your gross salary, civil status, and number of dependents, then swipe through a 15-screen story that breaks down your effective tax rate, your position among Catalan taxpayers, how your IRPF is distributed across departments, the top programmes you're funding, and the state's deficit per capita — ending on a shareable recap card.

Inspired by [Tax Wrapped](https://impotswrapped.com/), adapted to the Catalan tax system and public finances.

## Demo

Run locally (see below) and open `http://localhost:5173`. The viewport is capped at 390 px so the experience is always "phone", even on desktop.

## Stack

- **Vite + React + TypeScript** — fast SPA, no backend
- **Tailwind CSS** — mobile-first, flat-color palette with SVG background patterns
- **Framer Motion** — screen transitions and the story-progress bar
- **Recharts** — donut chart for the department breakdown
- **`html-to-image` + Web Share API** — PNG export of the recap card

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview
```

If `npm install` fails on macOS with `Invalid time value` because of a `before=null` line in `/opt/homebrew/etc/npmrc`, nuke that file: `: > /opt/homebrew/etc/npmrc`.

## How it works

### Tax model — `src/lib/tax.ts`

Simplified Spanish / Catalan employee calculation:

1. Social Security employee contribution (6.35 % + 0.7 % MEI, capped at *base máxima*).
2. *Reducció per rendiments del treball* on a sliding scale.
3. Personal + family minimum (couple + per-child increments).
4. State IRPF brackets + Catalan autonomic brackets applied to the taxable base, minus the bracketed minimum.

Returns `{ socialSecurity, incomeTax, totalTax, netAnnual, effectiveRate }` and a department-weighted allocation of the user's IRPF using `src/data/budget.json`.

Out of scope: *pluriempleo*, non-work income, regional deductions, split-couple filing.

### Data — `src/data/*.json`

All datasets ship as JSON, so the app is fully static:

| File | What | Source |
|---|---|---|
| `taxBrackets.json` | 2025 IRPF brackets (state + Catalan), SS rates, personal/family minimums | BOE + DOGC (Llei 24/2010, Llei 5/2020) |
| `budget.json` | Generalitat 2025 budget by department area | Pressupostos Generalitat (Llei 6/2025) |
| `spending.json` | Top-5 specific programmes used for the category screens | Generalitat budget + curated unit costs |
| `stats.json` | Population, revenue, spending, deficit per capita, outstanding debt | Idescat + Generalitat |
| `comparisons.json` | Quirky comparison units (T-usual, menú del dia, …) | Curated |

Numbers were seeded via research on datasets federated by [opendata.cat](https://opendata.cat/mcp/). The project ships an `.mcp.json` for the `opendata.cat` MCP server so future updates can be pulled live from Claude Code.

### UX

- `PhoneFrame` — locks viewport at 390 px centred on desktop
- `StoryProgress` — Instagram-style top progress bar
- `SwipeContainer` — tap-right / tap-left / swipe; auto-advances every 6.5 s on content screens
- `ScreenBg` — flat colour + SVG pattern combo; four-colour palette across all screens

## Structure

```
src/
├── App.tsx                # story orchestration
├── components/            # PhoneFrame, StoryProgress, SwipeContainer, ScreenBg, …
├── screens/               # one file per story beat (15 total)
├── state/WrappedContext   # inputs + derived breakdown
├── lib/                   # tax, compare, format helpers
└── data/                  # all numbers live here
```

## Share

The recap screen renders a black "wrapped" card and exports it with `html-to-image`. On supported browsers it hands the PNG to `navigator.share`; otherwise it triggers a download.

## License

[MIT](./LICENSE) © 2026 Joan Alavedra. Data belongs to its original sources (Generalitat de Catalunya, Idescat).
