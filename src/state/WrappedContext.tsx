import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { computeTax, type TaxBreakdown, type TaxInputs } from '../lib/tax'

interface WrappedState {
  inputs: TaxInputs | null
  setInputs: (i: TaxInputs) => void
  breakdown: TaxBreakdown | null
  reset: () => void
}

const Ctx = createContext<WrappedState | null>(null)

export function WrappedProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<TaxInputs | null>(null)
  const breakdown = useMemo(() => (inputs ? computeTax(inputs) : null), [inputs])
  const value: WrappedState = {
    inputs,
    setInputs,
    breakdown,
    reset: () => setInputs(null),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWrapped(): WrappedState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useWrapped outside provider')
  return v
}
