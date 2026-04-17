import { AnimatedNumber } from '../components/AnimatedNumber'
import { ScreenBg } from '../components/ScreenBg'
import { eur, pct } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'

export function ContributionScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null

  return (
    <ScreenBg variant="coral-dots">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
        La nòmina per dins
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        D'on surt cada euro que aportes
      </h1>

      <div className="mt-5 flex flex-col gap-2">
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
        <div className="text-xs font-semibold opacity-80">Taxa efectiva</div>
        <div className="font-display text-6xl font-bold leading-none tabular-nums">
          <AnimatedNumber value={breakdown.effectiveRate} format={(n) => pct(n)} />
        </div>
        <div className="mt-2 text-xs opacity-80 leading-snug">
          De cada 100 € que guanyes, se'n queden{' '}
          <span className="font-bold">{pct(breakdown.effectiveRate)}</span>.
        </div>
      </div>
    </ScreenBg>
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
      className={`flex items-baseline justify-between gap-3 rounded-xl border px-3 py-2 ${
        tone === 'soft' ? 'border-white/40 bg-white/15' : 'border-white/20'
      }`}
    >
      <span className="text-xs font-semibold opacity-90 truncate">{label}</span>
      <span className="font-display text-base font-bold tabular-nums whitespace-nowrap">
        {value}
      </span>
    </div>
  )
}
