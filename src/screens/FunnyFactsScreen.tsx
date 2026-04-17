import { ScreenBg } from '../components/ScreenBg'
import { eur, num, pct } from '../lib/format'
import { categoryContribution } from '../lib/tax'
import { pickComparison } from '../lib/compare'
import { useWrapped } from '../state/WrappedContext'
import spending from '../data/spending.json'
import budget from '../data/budget.json'

export function FunnyFactsScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null

  const categoryFacts = spending.categories.map((c) => {
    const yours = categoryContribution(breakdown.totalTax, c.amount)
    const units = yours / c.unitCostEur
    return {
      emoji: c.emoji,
      label: c.label,
      detail: c.stat.replace('{units}', num(units)),
    }
  })

  const interestDept = budget.departments.find((d) => d.key === 'interessos_deute')
  const interestYours = interestDept
    ? categoryContribution(breakdown.totalTax, interestDept.amount)
    : 0
  const comp = pickComparison(breakdown.totalTax)
  const hoursForGov = breakdown.effectiveRate * 8

  const facts: { emoji: string; label: string; detail: string }[] = [
    ...categoryFacts,
    {
      emoji: '💸',
      label: 'Interessos del deute',
      detail: `${eur(interestYours)} dels teus impostos paguen interessos, no pas serveis.`,
    },
    {
      emoji: '⏱️',
      label: 'Hores pel govern',
      detail: `Treballes ${hoursForGov.toFixed(1)} h cada dia per a Hisenda (jornada de 8 h).`,
    },
    {
      emoji: comp.emoji,
      label: 'En comparacions tontes',
      detail: `El teu total són ${num(comp.units)} ${comp.label}.`,
    },
    {
      emoji: '📊',
      label: 'Tipus efectiu',
      detail: `De cada 100 € que guanyes, Hisenda se'n queda ${pct(breakdown.effectiveRate)}.`,
    },
  ]

  return (
    <ScreenBg variant="cream-waves">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
        Totes les dades, juntes
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        El teu any en curiositats
      </h1>

      <div className="mt-3 flex-1 overflow-y-auto no-scrollbar">
        <div className="divide-y divide-black/15 rounded-2xl border-2 border-black/80 bg-white/70">
          {facts.map((f, i) => (
            <div key={i} className="flex gap-3 px-3 py-2.5">
              <span className="text-lg leading-5 w-6 flex-shrink-0 text-center">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
                  {f.label}
                </div>
                <div className="text-xs font-medium leading-snug mt-0.5">{f.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 text-[10px] opacity-70">
        Tots els càlculs són sobre {eur(breakdown.totalTax)} d'impostos totals.
      </div>
    </ScreenBg>
  )
}
