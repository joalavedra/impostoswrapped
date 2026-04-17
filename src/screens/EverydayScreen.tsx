import { AnimatedNumber } from '../components/AnimatedNumber'
import { ScreenBg } from '../components/ScreenBg'
import { eur } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'

export function EverydayScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null
  const tax = breakdown.totalTax
  const perMonth = tax / 12
  const perDay = tax / 365
  const perMinute = tax / (365 * 24 * 60)
  const hoursForGov = breakdown.effectiveRate * 8
  const hoursInt = Math.floor(hoursForGov)
  const minutesExtra = Math.round((hoursForGov - hoursInt) * 60)

  return (
    <ScreenBg variant="lime-stripes">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
        El compte del dia a dia
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        Cada minut hi poses…
      </h1>

      <div className="mt-6 flex flex-col gap-5">
        <Big
          label="al mes"
          value={<AnimatedNumber value={perMonth} format={(n) => eur(n)} />}
        />
        <Big
          label="al dia"
          value={<AnimatedNumber value={perDay} format={(n) => eur(n, true)} />}
        />
        <Big
          label="al minut"
          value={<AnimatedNumber value={perMinute} format={(n) => eur(n, true)} />}
        />
      </div>

      <div className="mt-auto text-xs font-semibold opacity-80 leading-snug">
        Cada dia treballes{' '}
        <span className="font-bold tabular-nums">
          {hoursInt}h{minutesExtra > 0 ? ` ${minutesExtra}m` : ''}
        </span>{' '}
        per al govern (sobre una jornada de 8 h). La resta ja és per a tu.
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
