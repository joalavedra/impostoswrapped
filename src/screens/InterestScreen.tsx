import { AnimatedNumber } from '../components/AnimatedNumber'
import { ScreenBg } from '../components/ScreenBg'
import { eur, pct } from '../lib/format'
import { categoryContribution } from '../lib/tax'
import { useWrapped } from '../state/WrappedContext'
import budget from '../data/budget.json'
import stats from '../data/stats.json'

export function InterestScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null
  const interestDept = budget.departments.find((d) => d.key === 'interessos_deute')!
  const yours = categoryContribution(breakdown.totalTax, interestDept.amount)
  const share = yours / breakdown.totalTax

  return (
    <ScreenBg variant="dark-grid">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
        I ara, la part lletja
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        Interessos del deute 💸
      </h1>

      <div className="mt-2 text-xs opacity-80 leading-snug">
        Cada any, la Generalitat crema{' '}
        <span className="font-bold tabular-nums whitespace-nowrap">
          {eur(interestDept.amount * 1_000_000)}
        </span>{' '}
        només per pagar interessos ({eur(stats.debtOutstanding * 1_000_000)} de deute pendent).
      </div>

      <div className="mt-8">
        <div className="text-[10px] font-semibold opacity-70 uppercase tracking-widest">
          la teva part
        </div>
        <div className="font-display text-6xl font-bold leading-none tabular-nums text-wrap-coral">
          <AnimatedNumber value={yours} format={(n) => eur(n)} />
        </div>
        <div className="mt-2 text-xs opacity-80 leading-snug">
          {pct(share)} dels teus impostos han anat a pagar{' '}
          <span className="font-semibold">interessos</span>, no pas serveis.
        </div>
      </div>

      <div className="mt-auto text-xs font-semibold opacity-80">
        I com es possible això? Ara t'ho explico
      </div>
    </ScreenBg>
  )
}
