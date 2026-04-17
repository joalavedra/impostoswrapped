const eurFmt = new Intl.NumberFormat('ca-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})
const eurFmtPrecise = new Intl.NumberFormat('ca-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})
const numFmt = new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 0 })
const pctFmt = new Intl.NumberFormat('ca-ES', {
  style: 'percent',
  maximumFractionDigits: 1,
})

export function eur(v: number, precise = false): string {
  const fmt = precise ? eurFmtPrecise : eurFmt
  return fmt.format(Math.max(0, Math.round(precise ? v * 100 : v) / (precise ? 100 : 1)))
}

export function num(v: number): string {
  return numFmt.format(Math.round(v))
}

export function pct(v: number): string {
  return pctFmt.format(v)
}
