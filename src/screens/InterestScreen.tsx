import { AnimatedNumber } from '../components/AnimatedNumber'
import { eur, pct } from '../lib/format'
import { categoryContribution } from '../lib/tax'
import { useWrapped } from '../state/WrappedContext'
import budget from '../data/budget.json'
import stats from '../data/stats.json'

export function InterestScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null
  const interestDept = budget.departments.find((d) => d.key === 'interessos_deute')!
  const yours = categoryContribution(breakdown.incomeTax, interestDept.amount)
  const share = yours / breakdown.totalTax

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black text-white px-6 pt-16 pb-10 flex flex-col">
      <div className="text-xs uppercase tracking-widest font-semibold opacity-70">
        I ara, la part amarga
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight mt-1">
        Interessos del deute
      </h1>

      <div className="mt-2 text-sm opacity-80">
        Cada any, la Generalitat paga <span className="font-bold">{eur(interestDept.amount * 1_000_000)}</span> només en interessos del deute acumulat ({eur(stats.debtOutstanding * 1_000_000)} pendents).
      </div>

      <div className="mt-10">
        <div className="text-xs font-semibold opacity-70 uppercase tracking-widest">
          la teva part
        </div>
        <div className="font-display text-7xl font-bold leading-none text-wrap-coral">
          <AnimatedNumber value={yours} format={(n) => eur(n)} />
        </div>
        <div className="mt-2 text-sm opacity-80">
          {pct(share)} dels teus impostos han anat a pagar{' '}
          <span className="font-semibold">interessos</span>, no serveis.
        </div>
      </div>

      <div className="mt-auto text-sm font-semibold opacity-80">
        Parlem un moment de per què passa això…
      </div>
    </div>
  )
}
