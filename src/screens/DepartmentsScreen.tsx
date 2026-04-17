import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ScreenBg } from '../components/ScreenBg'
import { eur, pct } from '../lib/format'
import { useWrapped } from '../state/WrappedContext'
import budget from '../data/budget.json'

export function DepartmentsScreen() {
  const { breakdown } = useWrapped()
  if (!breakdown) return null
  const total = breakdown.incomeTax
  const data = breakdown.departmentAllocation.slice().sort((a, b) => b.amount - a.amount)

  return (
    <ScreenBg variant="coral-grid">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
        A on van a parar els teus IRPF
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        El teu pressupost, com una piruleta
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
          <div className="text-[9px] uppercase opacity-80 font-semibold">IRPF</div>
          <div className="font-display text-base font-bold tabular-nums">{eur(total)}</div>
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
            <span className="opacity-80 tabular-nums">{pct(d.amount / total)}</span>
            <span className="w-14 text-right font-display font-bold tabular-nums">
              {eur(d.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-1 text-[9px] opacity-80">
        Pressupost Generalitat {budget.year} · proporcions aplicades al teu IRPF 🥧
      </div>
    </ScreenBg>
  )
}
