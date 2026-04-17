import { AnimatedNumber } from '../components/AnimatedNumber'
import { eur, pct } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'

export function ContributionScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-wrap-coral to-wrap-plum text-white px-6 pt-16 pb-10 flex flex-col">
      <div className="text-xs uppercase tracking-widest font-semibold opacity-80">
        La nòmina per dins
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight mt-1">
        D'on surt cada euro que aportes
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        <Row label="Nòmina bruta" value={eur(breakdown.grossAnnual)} tone="soft" />
        <Row
          label="− Seguretat Social"
          value={<AnimatedNumber value={breakdown.socialSecurity} format={(n) => eur(n)} />}
        />
        <Row
          label="− IRPF"
          value={<AnimatedNumber value={breakdown.incomeTax} format={(n) => eur(n)} />}
        />
        <Row
          label="Net al compte"
          value={<AnimatedNumber value={breakdown.netAnnual} format={(n) => eur(n)} />}
          tone="soft"
        />
      </div>

      <div className="mt-auto">
        <div className="text-sm font-semibold opacity-80">Taxa efectiva</div>
        <div className="font-display text-7xl font-bold leading-none">
          <AnimatedNumber value={breakdown.effectiveRate} format={(n) => pct(n)} />
        </div>
        <div className="mt-2 text-sm opacity-80">
          De cada 100 € que guanyes, l'Estat se'n queda{' '}
          <span className="font-bold">{pct(breakdown.effectiveRate)}</span>.
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  tone,
}: {
  label: string
  value: React.ReactNode
  tone?: 'soft'
}) {
  return (
    <div
      className={`flex items-baseline justify-between rounded-2xl border ${
        tone === 'soft' ? 'border-white/40 bg-white/10' : 'border-white/20'
      } px-4 py-3`}
    >
      <span className="text-sm font-semibold opacity-90">{label}</span>
      <span className="font-display text-xl font-bold">{value}</span>
    </div>
  )
}
