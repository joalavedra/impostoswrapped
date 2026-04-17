import { AnimatedNumber } from '../components/AnimatedNumber'
import { eur } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'
import stats from '../data/stats.json'

function percentile(gross: number): number {
  const pts: [number, number][] = [
    [0, 0],
    [stats.p25GrossSalary, 25],
    [stats.medianGrossSalary, 50],
    [stats.p75GrossSalary, 75],
    [stats.p90GrossSalary, 90],
    [stats.p99GrossSalary, 99],
    [stats.p99GrossSalary * 2, 99.9],
  ]
  for (let i = 1; i < pts.length; i++) {
    if (gross <= pts[i][0]) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i]
      const r = (gross - x0) / Math.max(1, x1 - x0)
      return y0 + r * (y1 - y0)
    }
  }
  return 99.9
}

function tier(p: number): { label: string; tone: string } {
  if (p < 33) return { label: 'Bottom', tone: 'del terç baix' }
  if (p < 66) return { label: 'Middle', tone: 'del terç mitjà' }
  if (p < 90) return { label: 'Top 25%', tone: 'del quart superior' }
  return { label: 'Top 10%', tone: "entre l'elit catalana" }
}

export function PositionScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null
  const p = percentile(breakdown.grossAnnual)
  const t = tier(p)

  const buckets: { label: string; weight: number }[] = [
    { label: '<17k', weight: 25 },
    { label: '17–28k', weight: 30 },
    { label: '28–40k', weight: 20 },
    { label: '40–60k', weight: 15 },
    { label: '60–135k', weight: 9 },
    { label: '>135k', weight: 1 },
  ]
  const userBucket = breakdown.grossAnnual < 17000
    ? 0
    : breakdown.grossAnnual < 28000
      ? 1
      : breakdown.grossAnnual < 40000
        ? 2
        : breakdown.grossAnnual < 60000
          ? 3
          : breakdown.grossAnnual < 135000
            ? 4
            : 5

  const maxW = Math.max(...buckets.map((b) => b.weight))

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-wrap-blue to-wrap-plum text-white px-6 pt-16 pb-10 flex flex-col">
      <div className="text-xs uppercase tracking-widest font-semibold opacity-80">
        On et situes
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight mt-1">
        Et presentem als teus {' '}
        <span className="text-wrap-lime">{t.label}</span> veïns
      </h1>

      <div className="mt-6">
        <div className="font-display text-6xl font-bold">
          <AnimatedNumber value={p} format={(n) => `P${n.toFixed(0)}`} />
        </div>
        <div className="mt-1 text-sm opacity-85">
          Estàs {t.tone} dels contribuents catalans (salari brut{' '}
          <span className="font-bold">{eur(breakdown.grossAnnual)}</span>).
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {buckets.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3">
            <div className="w-16 text-xs font-semibold opacity-80">{b.label}</div>
            <div className="flex-1 h-5 rounded-full bg-white/15 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  i === userBucket ? 'bg-wrap-lime' : 'bg-white/70'
                }`}
                style={{ width: `${(b.weight / maxW) * 100}%` }}
              />
            </div>
            <div className="w-8 text-right text-xs font-semibold opacity-80">{b.weight}%</div>
          </div>
        ))}
      </div>

      <div className="mt-auto text-xs opacity-70">
        Font: Idescat, distribució de rendes del treball {stats.year}
      </div>
    </div>
  )
}
