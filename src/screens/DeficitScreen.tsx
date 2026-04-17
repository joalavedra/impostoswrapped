import { AnimatedNumber } from '../components/AnimatedNumber'
import { ScreenBg } from '../components/ScreenBg'
import { eur, num } from '../lib/format'
import { pickComparison } from '../lib/compare'
import stats from '../data/stats.json'

export function DeficitScreen() {
  const comp = pickComparison(stats.deficitPerCapita)

  return (
    <ScreenBg variant="plum-stripes">
      <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
        Dèficit per càpita
      </div>
      <h1 className="font-display text-2xl font-bold leading-tight mt-1">
        Cada català deu una mica més aquest any
      </h1>

      <div className="mt-8">
        <div className="text-[10px] font-semibold opacity-70 uppercase tracking-widest">
          per cada habitant
        </div>
        <div className="font-display text-6xl font-bold leading-none tabular-nums">
          <AnimatedNumber value={stats.deficitPerCapita} format={(n) => eur(n)} />
        </div>
        <div className="mt-2 text-xs opacity-85 leading-snug">
          és el que ha afegit la Generalitat al deute de cada català en {stats.year}.
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white/20 border border-white/25 p-3">
        <div className="text-xs font-medium leading-snug">
          Equival a uns{' '}
          <span className="font-bold tabular-nums">
            {num(comp.units)} {comp.label}
          </span>{' '}
          per cap.
        </div>
      </div>

      <div className="mt-auto text-[10px] opacity-75 leading-snug">
        Població: <span className="tabular-nums">{num(stats.population)}</span> · Deute viu:{' '}
        <span className="tabular-nums whitespace-nowrap">
          {eur(stats.debtOutstanding * 1_000_000)}
        </span>
      </div>
    </ScreenBg>
  )
}
