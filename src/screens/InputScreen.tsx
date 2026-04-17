import { useState } from 'react'
import { ScreenBg } from '../components/ScreenBg'
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

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()

  return (
    <ScreenBg variant="cream-waves">
      <div
        className="flex flex-1 flex-col"
        onClick={stop}
        onTouchStart={stop}
        onTouchEnd={stop}
        onMouseDown={stop}
      >
        <div>
          <div className="text-[10px] uppercase tracking-widest font-semibold opacity-60">
            Abans de començar
          </div>
          <h1 className="font-display text-2xl font-bold leading-tight mt-1">
            Explica'ns una mica de tu
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 mt-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Salari brut anual (€)</span>
            <input
              type="number"
              inputMode="numeric"
              value={gross}
              onChange={(e) => setGross(e.target.value)}
              className="min-w-0 rounded-2xl border-2 border-black/90 bg-white px-4 py-3 font-display text-xl font-bold tabular-nums focus:outline-none focus:ring-4 focus:ring-wrap-coral/40"
              placeholder="30000"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Situació familiar</span>
            <div className="grid grid-cols-2 gap-2">
              {(['single', 'couple'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-2xl border-2 border-black/90 py-2.5 font-display text-base font-bold transition ${
                    status === s ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {s === 'single' ? 'Sol/a' : 'Parella'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Fills / dependents</span>
            <div className="flex items-center justify-between rounded-2xl border-2 border-black/90 bg-white px-3 py-2">
              <button
                type="button"
                onClick={() => setDependents((d) => Math.max(0, d - 1))}
                className="h-9 w-9 rounded-full bg-black text-white text-xl font-bold"
                aria-label="Treu un dependent"
              >
                −
              </button>
              <div className="font-display text-2xl font-bold tabular-nums">{dependents}</div>
              <button
                type="button"
                onClick={() => setDependents((d) => Math.min(10, d + 1))}
                className="h-9 w-9 rounded-full bg-black text-white text-xl font-bold"
                aria-label="Afegeix un dependent"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-auto rounded-full bg-black text-white py-3.5 text-base font-display font-bold active:scale-[0.98] transition"
          >
            Ensenya'm el Wrapped →
          </button>
        </form>
      </div>
    </ScreenBg>
  )
}
