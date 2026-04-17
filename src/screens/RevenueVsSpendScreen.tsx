import { AnimatedNumber } from '../components/AnimatedNumber'
import { ScreenBg } from '../components/ScreenBg'
import { eur } from '../lib/format'
import stats from '../data/stats.json'

export function RevenueVsSpendScreen() {
  const rev = stats.revenue
  const spend = stats.spending
  const max = Math.max(rev, spend)

  return (
    <ScreenBg variant="coral-grid">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
        Ingressos vs despeses
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        La Generalitat gasta més del que ingressa
      </h1>

      <div className="mt-6 space-y-4">
        <Bar label="Ingressa" value={rev} pct={rev / max} tone="bg-wrap-lime text-black" />
        <Bar label="Gasta" value={spend} pct={spend / max} tone="bg-black text-white" />
      </div>

      <div className="mt-6 rounded-xl bg-white/20 border border-white/30 p-3">
        <div className="text-[10px] font-semibold opacity-80 uppercase tracking-widest">
          diferència
        </div>
        <div className="font-display text-4xl font-bold leading-none tabular-nums">
          −<AnimatedNumber value={stats.deficit * 1_000_000} format={(n) => eur(n)} />
        </div>
        <div className="mt-1 text-xs opacity-90 leading-snug">
          El dèficit de {stats.year}. Es tapa emetent més deute.
        </div>
      </div>

      <div className="mt-auto text-[10px] opacity-80">
        Font: pressupost Generalitat {stats.year}
      </div>
    </ScreenBg>
  )
}

function Bar({
  label,
  value,
  pct,
  tone,
}: {
  label: string
  value: number
  pct: number
  tone: string
}) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span>{label}</span>
        <span className="tabular-nums whitespace-nowrap">{eur(value * 1_000_000)}</span>
      </div>
      <div className="h-9 rounded-lg bg-white/20 overflow-hidden">
        <div
          className={`h-full rounded-lg ${tone} flex items-center px-3 font-display font-bold text-sm`}
          style={{ width: `${pct * 100}%`, transition: 'width 900ms ease-out' }}
        >
          {label}
        </div>
      </div>
    </div>
  )
}
