import { useState } from 'react'
import { useWrapped } from '../state/WrappedContext'

export function InputScreen() {
  const { setInputs, inputs } = useWrapped()
  const [gross, setGross] = useState<string>(inputs ? String(inputs.grossAnnual) : '30000')
  const [status, setStatus] = useState<'single' | 'couple'>(inputs?.status ?? 'single')
  const [dependents, setDependents] = useState<number>(inputs?.dependents ?? 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const n = Number(gross)
    if (!Number.isFinite(n) || n <= 0) return
    setInputs({ grossAnnual: n, status, dependents })
  }

  return (
    <div
      className="absolute inset-0 flex flex-col bg-gradient-to-b from-wrap-cream to-[#f0e3c7] text-black px-6 pt-16 pb-10"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="mt-2">
        <div className="text-xs uppercase tracking-widest font-semibold opacity-60">
          Abans de començar
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight mt-1">
          Explica'ns una mica de tu
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 mt-8">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Salari brut anual (€)</span>
          <input
            type="number"
            inputMode="numeric"
            value={gross}
            onChange={(e) => setGross(e.target.value)}
            className="rounded-2xl border-2 border-black/90 bg-white px-4 py-3 text-2xl font-display font-bold focus:outline-none focus:ring-4 focus:ring-wrap-coral/40"
            placeholder="30000"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Situació familiar</span>
          <div className="grid grid-cols-2 gap-2">
            {(['single', 'couple'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-2xl border-2 border-black/90 py-3 font-display font-bold text-lg transition ${
                  status === s ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {s === 'single' ? 'Sol/a' : 'Parella'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Fills / dependents</span>
          <div className="flex items-center justify-between rounded-2xl border-2 border-black/90 bg-white px-4 py-2">
            <button
              type="button"
              onClick={() => setDependents((d) => Math.max(0, d - 1))}
              className="h-10 w-10 rounded-full bg-black text-white text-2xl font-bold"
              aria-label="Treu un dependent"
            >
              −
            </button>
            <div className="font-display text-3xl font-bold">{dependents}</div>
            <button
              type="button"
              onClick={() => setDependents((d) => Math.min(10, d + 1))}
              className="h-10 w-10 rounded-full bg-black text-white text-2xl font-bold"
              aria-label="Afegeix un dependent"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-auto rounded-full bg-black text-white py-4 text-lg font-display font-bold active:scale-[0.98] transition"
        >
          Ensenya'm el Wrapped →
        </button>
      </form>
    </div>
  )
}
