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
        La nòmina, sense filtres
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        On s'esmuny cada euro del teu sou
      </h1>

      <div className="mt-5 flex flex-col gap-2">
        <Row label="Brut a l'any" value={eur(breakdown.grossAnnual)} tone="soft" />
        <Row
          label="− Seguretat Social"
          value={<AnimatedNumber value={breakdown.socialSecurity} format={(n) => eur(n)} />}
        />
        {breakdown.solidarity > 0 && (
          <Row
            label="− Contribució de Solidaritat"
            value={<AnimatedNumber value={breakdown.solidarity} format={(n) => eur(n)} />}
          />
        )}
        <Row
          label="− State Income Tax (IRPF estatal)"
          value={<AnimatedNumber value={breakdown.stateTax} format={(n) => eur(n)} />}
        />
        <Row
          label="− Tram autonòmic (regional)"
          value={<AnimatedNumber value={breakdown.regionalTax} format={(n) => eur(n)} />}
        />
        <Row
          label="Salari net per tu"
          value={<AnimatedNumber value={breakdown.netAnnual} format={(n) => eur(n)} />}
          tone="soft"
        />
      </div>

      <div className="mt-auto">
        <div className="text-xs font-semibold opacity-80">Tipus efectiu</div>
        <div className="font-display text-6xl font-bold leading-none tabular-nums">
          <AnimatedNumber value={breakdown.effectiveRate} format={(n) => pct(n)} />
        </div>
        <div className="mt-2 text-xs opacity-80 leading-snug">
          De cada 100 € que guanyes, Hisenda se'n queda{' '}
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
      className={`flex items-baseline justify-between gap-3 rounded-xl border px-3 py-2 ${tone === 'soft' ? 'border-white/40 bg-white/15' : 'border-white/20'
        }`}
    >
      <span className="text-xs font-semibold opacity-90 truncate">{label}</span>
      <span className="font-display text-base font-bold tabular-nums whitespace-nowrap">
        {value}
      </span>
    </div>
  )
}
