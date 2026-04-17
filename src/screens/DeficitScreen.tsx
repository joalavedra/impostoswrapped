import { AnimatedNumber } from '../components/AnimatedNumber'
import { eur, num } from '../lib/format'
import { pickComparison } from '../lib/compare'
import stats from '../data/stats.json'

export function DeficitScreen() {
  const comp = pickComparison(stats.deficitPerCapita)

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-wrap-coral via-wrap-plum to-black text-white px-6 pt-16 pb-10 flex flex-col">
      <div className="text-xs uppercase tracking-widest font-semibold opacity-80">
        Dèficit per càpita
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight mt-1">
        Cada català deu una mica més aquest any
      </h1>

      <div className="mt-10">
        <div className="text-xs font-semibold opacity-70 uppercase tracking-widest">
          per cada habitant
        </div>
        <div className="font-display text-8xl font-bold leading-none">
          <AnimatedNumber value={stats.deficitPerCapita} format={(n) => eur(n)} />
        </div>
        <div className="mt-2 text-sm opacity-85">
          és el que ha afegit la Generalitat al deute de cada català en {stats.year}.
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white/15 border border-white/20 p-4">
        <div className="text-sm font-medium leading-snug">
          Equival a uns <span className="font-bold">{num(comp.units)} {comp.label}</span>{' '}
          per cap.
        </div>
      </div>

      <div className="mt-auto text-xs opacity-70">
        Població Catalunya: {num(stats.population)} · Deute viu: {eur(stats.debtOutstanding * 1_000_000)}
      </div>
    </div>
  )
}
