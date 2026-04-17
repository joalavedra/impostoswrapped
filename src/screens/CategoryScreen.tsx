import { AnimatedNumber } from '../components/AnimatedNumber'
import { ScreenBg, type BgVariant } from '../components/ScreenBg'
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
  endEmojis: string
  unitCostEur: number
}

const VARIANTS: BgVariant[] = [
  'plum-stripes',
  'lime-dots',
  'coral-dots',
  'plum-grid',
  'lime-stripes',
]

export function CategoryScreen({ category, rank }: { category: Category; rank: number }) {
  const { breakdown } = useWrapped()
  if (!breakdown) return null

  const yours = categoryContribution(breakdown.incomeTax, category.amount)
  const shareOfTotal = yours / breakdown.totalTax
  const units = yours / category.unitCostEur
  const funnyStat = category.stat.replace('{units}', num(units))
  const generic = pickComparison(yours)
  const variant = VARIANTS[(rank - 1) % VARIANTS.length]

  return (
    <ScreenBg variant={variant}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold">
        <span className="rounded-full bg-white/25 px-2 py-0.5">#{rank}</span>
        <span className="opacity-90">Destí estrella</span>
      </div>

      <div className="mt-4 text-5xl leading-none">{category.emoji}</div>
      <h1 className="font-display text-3xl font-bold leading-tight mt-2">{category.label}</h1>
      <div className="text-xs opacity-85 mt-1">{category.oneLiner}</div>

      <div className="mt-5">
        <div className="text-[10px] font-semibold opacity-80 uppercase tracking-widest">
          hi has posat
        </div>
        <div className="font-display text-6xl font-bold leading-none tabular-nums">
          <AnimatedNumber value={yours} format={(n) => eur(n)} />
        </div>
        <div className="mt-1 text-xs font-semibold opacity-90">
          {pct(shareOfTotal)} de tot el que aportes
        </div>
      </div>

      <div className="mt-auto space-y-2">
        <Fact emoji="💡" text={funnyStat} endEmojis={category.endEmojis} />
        <Fact
          emoji="🧾"
          text={`O, dit d'una altra manera: uns ${num(generic.units)} ${generic.label}.`}
          endEmojis={generic.emoji.repeat(3)}
        />
      </div>
    </ScreenBg>
  )
}

function Fact({
  emoji,
  text,
  endEmojis,
}: {
  emoji: string
  text: string
  endEmojis: string
}) {
  return (
    <div className="rounded-xl bg-white/20 px-3 py-2.5 border border-white/25">
      <div className="flex items-start gap-2">
        <span className="text-sm leading-5 w-4 flex-shrink-0 text-center">{emoji}</span>
        <span className="flex-1 text-xs font-medium leading-5">{text}</span>
      </div>
      <div className="mt-2 pl-6 text-base leading-none tracking-[0.2em]">{endEmojis}</div>
    </div>
  )
}
