import brackets from '../data/taxBrackets.json'
import budget from '../data/budget.json'

export interface TaxInputs {
  grossAnnual: number
  status: 'single' | 'couple'
  dependents: number
}

export interface TaxBreakdown {
  grossAnnual: number
  socialSecurity: number
  solidarity: number
  incomeTax: number
  totalTax: number
  netAnnual: number
  effectiveRate: number
  payrollDeductions: number
  departmentAllocation: { key: string; label: string; amount: number; color: string }[]
}

function applyBrackets(base: number, table: { from: number; rate: number }[]): number {
  if (base <= 0) return 0
  let tax = 0
  for (let i = 0; i < table.length; i++) {
    const lo = table[i].from
    const hi = i + 1 < table.length ? table[i + 1].from : Infinity
    if (base <= lo) break
    const segment = Math.min(base, hi) - lo
    tax += segment * table[i].rate
  }
  return tax
}

function earningsReduction(net: number): number {
  const { earningsReductionBase, earningsReductionMax, earningsReductionMin } = brackets
  if (net <= earningsReductionBase) return earningsReductionMax
  if (net >= earningsReductionBase + 5556) return earningsReductionMin
  const slope =
    (earningsReductionMax - earningsReductionMin) /
    (earningsReductionBase + 5556 - earningsReductionBase)
  return Math.max(
    earningsReductionMin,
    earningsReductionMax - (net - earningsReductionBase) * slope,
  )
}

function familyMinimum(status: 'single' | 'couple', dependents: number): number {
  let min = brackets.personalMinimum
  if (status === 'couple') min += brackets.spouseMinimum
  for (let i = 0; i < dependents; i++) {
    const inc =
      brackets.childMinimums[Math.min(i, brackets.childMinimums.length - 1)] ?? 4500
    min += inc
  }
  return min
}

export function computeTax(inputs: TaxInputs): TaxBreakdown {
  const gross = Math.max(0, inputs.grossAnnual)

  const ssBase = Math.min(gross, brackets.socialSecurityBaseMax)
  const socialSecurity =
    ssBase * (brackets.socialSecurityEmployeeRate + brackets.socialSecurityMIEIRate)

  const solidarityExcess = Math.max(0, gross - brackets.socialSecurityBaseMax)
  const solidarity = applyBrackets(solidarityExcess, brackets.solidarity)

  const netWork = gross - socialSecurity - solidarity
  const reduction = earningsReduction(netWork)
  const taxableBase = Math.max(0, netWork - reduction)

  const minimum = familyMinimum(inputs.status, inputs.dependents)

  const stateGross = applyBrackets(taxableBase, brackets.state)
  const stateOnMin = applyBrackets(Math.min(taxableBase, minimum), brackets.state)
  const stateTax = Math.max(0, stateGross - stateOnMin)

  const catGross = applyBrackets(taxableBase, brackets.catalonia)
  const catOnMin = applyBrackets(Math.min(taxableBase, minimum), brackets.catalonia)
  const catTax = Math.max(0, catGross - catOnMin)

  const incomeTax = stateTax + catTax
  const totalTax = socialSecurity + solidarity + incomeTax
  const netAnnual = gross - totalTax
  const effectiveRate = gross > 0 ? totalTax / gross : 0

  const departmentAllocation = budget.departments.map((d) => ({
    key: d.key,
    label: d.label,
    color: d.color,
    amount: (d.amount / budget.total) * incomeTax,
  }))

  return {
    grossAnnual: gross,
    socialSecurity,
    solidarity,
    incomeTax,
    totalTax,
    netAnnual,
    effectiveRate,
    payrollDeductions: totalTax,
    departmentAllocation,
  }
}

export function categoryContribution(
  totalIncomeTax: number,
  categoryAmountTotal: number,
): number {
  return (categoryAmountTotal / budget.total) * totalIncomeTax
}
