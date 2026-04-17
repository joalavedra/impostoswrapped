import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ScreenBg } from '../components/ScreenBg'
import { eur, pct } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'
import budget from '../data/budget.json'

export function DepartmentsScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null

  const total = breakdown.totalTax
  const data = breakdown.departmentAllocation.slice().sort((a, b) => b.amount - a.amount)
  const investmentTotal = data
    .filter((d) => d.type === 'investment')
    .reduce((s, d) => s + d.amount, 0)
  const expenseTotal = data
    .filter((d) => d.type === 'expense')
    .reduce((s, d) => s + d.amount, 0)

  return (
    <ScreenBg variant="coral-grid">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
        A on van a parar els teus impostos
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        Amb què inverteixes el teu sou?
      </h1>

      <div className="relative mx-auto mt-3 h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              innerRadius={44}
              outerRadius={78}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[9px] uppercase opacity-80 font-semibold">Total</div>
          <div className="font-display text-base font-bold tabular-nums">{eur(total)}</div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-semibold">
        <div className="rounded-lg border border-white/30 bg-white/10 px-2 py-1 flex items-baseline justify-between">
          <span>🌱 Inversió</span>
          <span className="tabular-nums">{pct(investmentTotal / total)}</span>
        </div>
        <div className="rounded-lg border border-white/30 bg-black/20 px-2 py-1 flex items-baseline justify-between">
          <span>🔥 Despesa</span>
          <span className="tabular-nums">{pct(expenseTotal / total)}</span>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto no-scrollbar space-y-1">
        {data.map((d) => (
          <div key={d.key} className="flex items-center gap-2 text-[11px]">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: d.color }}
            />
            <span className="flex-1 font-semibold truncate">{d.label}</span>
            <span
              className={`text-[9px] uppercase tracking-wider font-bold rounded-full px-1.5 py-0.5 ${
                d.type === 'investment'
                  ? 'bg-wrap-lime text-black'
                  : 'bg-black/70 text-white'
              }`}
            >
              {d.type === 'investment' ? 'Inversió' : 'Despesa'}
            </span>
            <span className="w-14 text-right font-display font-bold tabular-nums">
              {eur(d.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-1 text-[9px] opacity-80">
        Pressupost Generalitat {budget.year} · proporcions aplicades al total d'impostos 🥧
      </div>
    </ScreenBg>
  )
}
