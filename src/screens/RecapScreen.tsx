import { useCallback, useRef } from 'react'
import { toPng } from 'html-to-image'
import { ScreenBg } from '../components/ScreenBg'
import { eur, num, pct } from '../lib/format'
import { categoryContribution } from '../lib/tax'
import { pickComparison } from '../lib/compare'
import { useWrapped } from '../state/WrappedContext'
import spending from '../data/spending.json'
import stats from '../data/stats.json'

export function RecapScreen() {
  const { breakdown, reset } = useWrapped()
  const cardRef = useRef<HTMLDivElement>(null)

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'impostos-wrapped-2024.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'El meu ImpostosWrapped 2024',
            text: 'Mira on han anat els meus impostos aquest any.',
          })
          return
        }
      }
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'impostos-wrapped-2024.png'
      a.click()
    } catch (err) {
      console.error(err)
    }
  }, [])

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()

  if (!breakdown) return null

  const top = spending.categories[0]
  const topYours = categoryContribution(breakdown.incomeTax, top.amount)
  const comp = pickComparison(breakdown.totalTax)

  return (
    <ScreenBg variant="cream-waves">
      <div
        className="flex flex-1 flex-col"
        onClick={stop}
        onTouchStart={stop}
        onTouchEnd={stop}
        onMouseDown={stop}
      >
        <div className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
          Resum final
        </div>
        <h1 className="font-display text-2xl font-bold leading-tight mt-1">
          El teu 2024, aportat
        </h1>

        <div
          ref={cardRef}
          className="mt-3 rounded-2xl bg-black text-white p-4 shadow-xl border border-black/10 space-y-3"
        >
          <div className="flex items-baseline justify-between">
            <div className="font-display text-base font-bold">ImpostosWrapped</div>
            <div className="text-[10px] opacity-70">2024</div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest opacity-60">Total aportat</div>
            <div className="font-display text-3xl font-bold leading-none tabular-nums">
              {eur(breakdown.totalTax)}
            </div>
            <div className="text-[11px] opacity-75 mt-1">
              Taxa efectiva {pct(breakdown.effectiveRate)}
            </div>
          </div>
          <div className="h-px bg-white/15" />
          <Stat
            label="#1 destinació"
            value={`${top.emoji} ${top.label}`}
            sub={`${eur(topYours)} aportats`}
          />
          <Stat
            label="Dèficit per càpita"
            value={eur(stats.deficitPerCapita)}
            sub="afegits al deute per català"
          />
          <Stat
            label="Comparació divertida"
            value={`${num(comp.units)}`}
            sub={comp.label}
          />
          <div className="text-[9px] opacity-60 pt-1">Dades: Generalitat + Idescat</div>
        </div>

        <div className="mt-auto flex gap-2 pt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              reset()
            }}
            className="flex-1 rounded-full bg-white/70 backdrop-blur text-black py-2.5 text-sm font-display font-bold active:scale-[0.98] transition"
          >
            Torna-ho a fer
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-[2] rounded-full bg-black text-white py-2.5 text-sm font-display font-bold active:scale-[0.98] transition"
          >
            Comparteix ↗
          </button>
        </div>
      </div>
    </ScreenBg>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest opacity-60">{label}</div>
      <div className="font-display text-base font-bold leading-tight">{value}</div>
      <div className="text-[11px] opacity-70">{sub}</div>
    </div>
  )
}
