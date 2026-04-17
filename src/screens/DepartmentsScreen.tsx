import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { eur, pct } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'
import budget from '../data/budget.json'

export function DepartmentsScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null
  const total = breakdown.incomeTax
  const data = breakdown.departmentAllocation
    .slice()
    .sort((a, b) => b.amount - a.amount)

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-wrap-lime to-wrap-blue text-black px-6 pt-16 pb-10 flex flex-col">
      <div className="text-xs uppercase tracking-widest font-semibold opacity-70">
        On van els teus IRPF
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight mt-1">
        El teu pressupost, en una piruleta
      </h1>

      <div className="relative mx-auto mt-4 h-48 w-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              innerRadius={52}
              outerRadius={90}
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
          <div className="text-[10px] uppercase opacity-70 font-semibold">IRPF</div>
          <div className="font-display text-xl font-bold">{eur(total)}</div>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto no-scrollbar space-y-1.5">
        {data.map((d) => (
          <div key={d.key} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: d.color }}
            />
            <span className="flex-1 font-semibold truncate">{d.label}</span>
            <span className="opacity-70 tabular-nums">{pct(d.amount / total)}</span>
            <span className="w-16 text-right font-display font-bold tabular-nums">
              {eur(d.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[10px] opacity-70">
        Pressupost Generalitat {budget.year} · proporcions aplicades al teu IRPF
      </div>
    </div>
  )
}
