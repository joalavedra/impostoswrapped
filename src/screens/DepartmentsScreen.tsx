import { ScreenBg } from '../components/ScreenBg'
import { eur, pct } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'
import budget from '../data/budget.json'

export function DepartmentsScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null

  const total = breakdown.totalTax
  const investment = breakdown.departmentAllocation
    .filter((d) => d.type === 'investment')
    .sort((a, b) => b.amount - a.amount)
  const expense = breakdown.departmentAllocation
    .filter((d) => d.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
  const investmentTotal = investment.reduce((s, d) => s + d.amount, 0)
  const expenseTotal = expense.reduce((s, d) => s + d.amount, 0)

  return (
    <ScreenBg variant="coral-grid">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
        Despesa vs Inversió
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        Els teus diners: gastats o invertits?
      </h1>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Summary
          label="Inversió"
          emoji="🌱"
          amount={investmentTotal}
          share={investmentTotal / total}
          tone="bg-wrap-lime text-black border-black/80"
        />
        <Summary
          label="Despesa"
          emoji="🔥"
          amount={expenseTotal}
          share={expenseTotal / total}
          tone="bg-black text-white border-white/30"
        />
      </div>

      <div className="mt-4 flex-1 overflow-y-auto no-scrollbar space-y-3">
        <Bucket title="🌱 Inversió" items={investment} total={total} />
        <Bucket title="🔥 Despesa" items={expense} total={total} />
      </div>

      <div className="mt-1 text-[9px] opacity-80">
        Pressupost Generalitat {budget.year} · aplicat al total d'impostos que pagues
      </div>
    </ScreenBg>
  )
}

function Summary({
  label,
  emoji,
  amount,
  share,
  tone,
}: {
  label: string
  emoji: string
  amount: number
  share: number
  tone: string
}) {
  return (
    <div className={`rounded-2xl border p-3 ${tone}`}>
      <div className="text-[9px] uppercase tracking-widest font-semibold opacity-80">
        {emoji} {label}
      </div>
      <div className="font-display text-xl font-bold leading-none tabular-nums mt-1">
        {eur(amount)}
      </div>
      <div className="text-[11px] font-semibold mt-0.5 tabular-nums">{pct(share)}</div>
    </div>
  )
}

function Bucket({
  title,
  items,
  total,
}: {
  title: string
  items: { key: string; label: string; amount: number; color: string }[]
  total: number
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold opacity-80 uppercase tracking-widest mb-1">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((d) => (
          <div key={d.key} className="flex items-center gap-2 text-[11px]">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: d.color }}
            />
            <span className="flex-1 font-semibold truncate">{d.label}</span>
            <span className="opacity-80 tabular-nums">{pct(d.amount / total)}</span>
            <span className="w-16 text-right font-display font-bold tabular-nums">
              {eur(d.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
