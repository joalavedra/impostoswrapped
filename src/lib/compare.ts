import comparisons from '../data/comparisons.json'

export interface Comparison {
  units: number
  label: string
  emoji: string
}

const EMOJIS: Record<string, string> = {
  menu_dia: '🍽️',
  tusual: '🎫',
  cafes: '☕',
  lloguer_bcn: '🏠',
  cistella: '🛒',
  cervesa: '🍺',
  pa_cupcake: '🧁',
  entrada_camp: '⚽',
  truck_5e: '🚚',
}

export function pickComparison(amountEur: number): Comparison {
  const target = Math.max(1, amountEur)
  const scored = comparisons.units
    .map((u) => {
      const units = target / u.eur
      const closenessTo25 = Math.abs(Math.log10(units) - Math.log10(25))
      return { u, units, score: closenessTo25 }
    })
    .sort((a, b) => a.score - b.score)
  const pick = scored[0]
  return {
    units: pick.units,
    label: pick.u.label,
    emoji: EMOJIS[pick.u.key] ?? '✨',
  }
}
