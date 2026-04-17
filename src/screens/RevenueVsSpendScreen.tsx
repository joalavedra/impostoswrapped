import { AnimatedNumber } from '../components/AnimatedNumber'
import { eur } from '../lib/format'
import stats from '../data/stats.json'

export function RevenueVsSpendScreen() {
  const rev = stats.revenue
  const spend = stats.spending
  const max = Math.max(rev, spend)

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-wrap-blue to-neutral-900 text-white px-6 pt-16 pb-10 flex flex-col">
      <div className="text-xs uppercase tracking-widest font-semibold opacity-80">
        Ingressos vs despeses
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight mt-1">
        La Generalitat gasta més del que ingressa
      </h1>

      <div className="mt-10 space-y-6">
        <Bar
          label="Ingressa"
          value={rev}
          pct={rev / max}
          tone="bg-wrap-lime text-black"
        />
        <Bar
          label="Gasta"
          value={spend}
          pct={spend / max}
          tone="bg-wrap-coral text-white"
        />
      </div>

      <div className="mt-10 rounded-2xl bg-white/10 border border-white/20 p-4">
        <div className="text-xs font-semibold opacity-70 uppercase tracking-widest">
          diferència
        </div>
        <div className="font-display text-5xl font-bold text-wrap-coral">
          −<AnimatedNumber value={stats.deficit * 1_000_000} format={(n) => eur(n)} />
        </div>
        <div className="mt-1 text-sm opacity-80">
          El dèficit de {stats.year}. Es tapa emetent més deute.
        </div>
      </div>

      <div className="mt-auto text-xs opacity-60">
        Font: pressupost Generalitat {stats.year}, en milions d'euros
      </div>
    </div>
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
      <div className="flex justify-between text-sm font-semibold mb-1">
        <span>{label}</span>
        <span className="tabular-nums">{eur(value * 1_000_000)}</span>
      </div>
      <div className="h-10 rounded-xl bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-xl ${tone} flex items-center px-3 font-display font-bold`}
          style={{ width: `${pct * 100}%`, transition: 'width 900ms ease-out' }}
        >
          {label}
        </div>
      </div>
    </div>
  )
}
