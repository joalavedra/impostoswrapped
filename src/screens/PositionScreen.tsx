import { ScreenBg } from '../components/ScreenBg'
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

function positionLabel(p: number): { headline: string; rank: string; tone: string } {
  if (p >= 50) {
    const top = Math.max(1, Math.round(100 - p))
    return {
      headline: `Top ${top}%`,
      rank: `Top ${top}%`,
      tone:
        top <= 10
          ? "entre els qui més cobren de Catalunya"
          : top <= 25
            ? 'al quart de dalt de tot'
            : 'a la meitat que més cobra',
    }
  }
  const bottom = Math.max(1, Math.round(p))
  return {
    headline: `Bottom ${bottom}%`,
    rank: `Bottom ${bottom}%`,
    tone:
      bottom <= 25
        ? 'al quart que menys cobra'
        : 'a la meitat que menys cobra',
  }
}

export function PositionScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null
  const p = percentile(breakdown.grossAnnual)
  const t = positionLabel(p)

  const buckets: { label: string; weight: number }[] = [
    { label: '<17k', weight: 25 },
    { label: '17–28k', weight: 30 },
    { label: '28–40k', weight: 20 },
    { label: '40–60k', weight: 15 },
    { label: '60–135k', weight: 9 },
    { label: '>135k', weight: 1 },
  ]
  const userBucket =
    breakdown.grossAnnual < 17000
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
    <ScreenBg variant="plum-grid">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
        La teva posició
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        Estàs al <span className="text-wrap-lime">{t.headline}</span>
      </h1>

      <div className="mt-5">
        <div className="font-display text-5xl font-bold leading-none tabular-nums">
          {t.rank}
        </div>
        <div className="mt-1.5 text-xs opacity-85 leading-snug">
          Et trobes {t.tone} (guanyes{' '}
          <span className="font-bold tabular-nums">{eur(breakdown.grossAnnual)}</span> brut).
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        {buckets.map((b, i) => (
          <div key={b.label} className="flex items-center gap-2 text-[11px]">
            <div className="w-14 font-semibold opacity-80 tabular-nums">{b.label}</div>
            <div className="flex-1 h-4 rounded-full bg-white/15 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  i === userBucket ? 'bg-wrap-lime' : 'bg-white/70'
                }`}
                style={{ width: `${(b.weight / maxW) * 100}%` }}
              />
            </div>
            <div className="w-8 text-right font-semibold opacity-80 tabular-nums">
              {b.weight}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto text-[10px] opacity-70">
        Font: Idescat, rendes del treball {stats.year}
      </div>
    </ScreenBg>
  )
}
