import { AnimatedNumber } from '../components/AnimatedNumber'
import { eur } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'

export function EverydayScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null
  const tax = breakdown.totalTax
  const perDay = tax / 365
  const perMonth = tax / 12
  const perWorkHour = tax / (365 * 24 * (5 / 7) * (1 / 3))

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-wrap-sun to-wrap-coral text-black px-6 pt-16 pb-10 flex flex-col">
      <div className="text-xs uppercase tracking-widest font-semibold opacity-70">
        El teu dia a dia
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight mt-1">
        Cada dia contribueixes amb…
      </h1>

      <div className="mt-10 space-y-6">
        <Big
          label="al dia"
          value={<AnimatedNumber value={perDay} format={(n) => eur(n, true)} />}
        />
        <Big
          label="al mes"
          value={<AnimatedNumber value={perMonth} format={(n) => eur(n)} />}
        />
        <Big
          label="per cada hora treballada"
          value={<AnimatedNumber value={perWorkHour} format={(n) => eur(n, true)} />}
        />
      </div>

      <div className="mt-auto text-sm font-semibold opacity-80">
        Fent 8 h al dia, de 9 a 11 h ja estàs treballant pels impostos. La resta, per tu.
      </div>
    </div>
  )
}

function Big({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold opacity-70 uppercase tracking-widest">{label}</div>
      <div className="font-display text-6xl font-bold leading-none">{value}</div>
    </div>
  )
}
