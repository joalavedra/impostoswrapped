import { AnimatedNumber } from '../components/AnimatedNumber'
import { ScreenBg } from '../components/ScreenBg'
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
    <ScreenBg variant="lime-stripes">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
        El compte del dia a dia
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        Cada dia hi poses…
      </h1>

      <div className="mt-6 flex flex-col gap-5">
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

      <div className="mt-auto text-xs font-semibold opacity-80 leading-snug">
        Fent 8 h al dia, fins a les 11 del matí treballes per a Hisenda. La resta del dia, ja és per a tu.
      </div>
    </ScreenBg>
  )
}

function Big({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold opacity-70 uppercase tracking-widest">
        {label}
      </div>
      <div className="font-display text-5xl font-bold leading-none tabular-nums">{value}</div>
    </div>
  )
}
