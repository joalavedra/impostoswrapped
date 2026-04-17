import { AnimatedNumber } from '../components/AnimatedNumber'
import { eur, num, pct } from '../lib/format'
import { categoryContribution } from '../lib/tax'
import { pickComparison } from '../lib/compare'
import { useWrapped } from '../state/WrappedContext'

interface Category {
  key: string
  label: string
  emoji: string
  department: string
  amount: number
  oneLiner: string
  stat: string
  unitCostEur: number
}

const palette = [
  'from-wrap-coral to-wrap-plum',
  'from-wrap-sun to-wrap-coral',
  'from-wrap-blue to-wrap-plum',
  'from-wrap-lime to-wrap-blue',
  'from-wrap-pink to-wrap-plum',
]

export function CategoryScreen({ category, rank }: { category: Category; rank: number }) {
  const { breakdown } = useWrapped()
  if (!breakdown) return null

  const yours = categoryContribution(breakdown.incomeTax, category.amount)
  const shareOfTotal = yours / breakdown.totalTax
  const units = yours / category.unitCostEur
  const funnyStat = category.stat.replace('{units}', num(units))
  const generic = pickComparison(yours)
  const gradient = palette[(rank - 1) % palette.length]

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} text-white px-6 pt-16 pb-10 flex flex-col`}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold opacity-90">
        <span className="rounded-full bg-white/20 px-2 py-0.5">#{rank}</span>
        <span>Aportació específica</span>
      </div>

      <div className="mt-6 text-6xl">{category.emoji}</div>
      <h1 className="font-display text-4xl font-bold leading-tight mt-2">{category.label}</h1>
      <div className="text-sm opacity-85 mt-1">{category.oneLiner}</div>

      <div className="mt-8">
        <div className="text-xs font-semibold opacity-80 uppercase tracking-widest">
          hi has posat
        </div>
        <div className="font-display text-7xl font-bold leading-none">
          <AnimatedNumber value={yours} format={(n) => eur(n)} />
        </div>
        <div className="mt-1 text-sm font-semibold opacity-90">
          {pct(shareOfTotal)} del total dels teus impostos
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <Fact emoji="💡" text={funnyStat} />
        <Fact
          emoji="🧾"
          text={`O també: uns ${num(generic.units)} ${generic.label}.`}
        />
      </div>
    </div>
  )
}

function Fact({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/15 px-4 py-3 border border-white/20">
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-medium leading-snug">{text}</span>
    </div>
  )
}
