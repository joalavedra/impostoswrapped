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
        const file = new File([blob], 'impostos-wrapped-2025.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'El meu ImpostosWrapped 2025',
            text: 'Mira on han anat els meus impostos aquest any.',
          })
          return
        }
      }
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'impostos-wrapped-2025.png'
      a.click()
    } catch (err) {
      console.error(err)
    }
  }, [])

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()

  if (!breakdown) return null

  const top = spending.categories[0]
  const topYours = categoryContribution(breakdown.totalTax, top.amount)
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
        <h1 className="font-display text-xl font-bold leading-tight mt-1">
          El teu 2025, aportat 🧾
        </h1>

        <div className="mt-3 rounded-2xl bg-black text-white p-4 shadow-xl border border-black/10 space-y-3">
          <div ref={cardRef} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="font-display text-base font-bold">El meu Impost Wrapped</div>
              <div className="text-[10px] opacity-70">2025</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest opacity-60">
                Total pagat
              </div>
              <div className="font-display text-3xl font-bold leading-none tabular-nums">
                {eur(breakdown.totalTax)}
              </div>
              <div className="text-[11px] opacity-75 mt-1">
                Tipus efectiu {pct(breakdown.effectiveRate)}
              </div>
            </div>
            <div className="h-px bg-white/15" />
            <Stat
              label="Major cost"
              value={`${top.emoji} ${top.label}`}
              sub={`${eur(topYours)} hi has posat tu sol/a`}
            />
            <Stat
              label="Dèficit per persona"
              value={eur(stats.deficitPerCapita)}
              sub="de diners que devem"
            />
            <Stat
              label="En perspectiva"
              value={`${comp.emoji} ${num(comp.units)}`}
              sub={comp.label}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                reset()
              }}
              className="flex-1 rounded-full border border-white/50 bg-white/10 text-white py-2 text-xs font-display font-bold active:scale-[0.98] transition"
            >
              Tornar a fer
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex-[2] rounded-full bg-white text-black py-2 text-xs font-display font-bold active:scale-[0.98] transition"
            >
              Comparteix ↗
            </button>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
          <SponsorCta
            headline="Estalvia amb Canigo"
            subcopy="Estalvia al 3% i no miris la nòmina"
            cta="Estalvia"
            url="https://getcanigo.com"
            tone="lime"
          />
          <SponsorCta
            headline="Invierteix amb Farao"
            subcopy="Fes créixer el que et queda"
            cta="Invierteix"
            url="https://getfarao.com"
            tone="plum"
          />
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

interface CtaProps {
  headline: string
  subcopy: string
  cta: string
  url: string
  tone: 'lime' | 'plum'
}

function SponsorCta({ headline, subcopy, cta, url, tone }: CtaProps) {
  const box =
    tone === 'lime'
      ? 'bg-wrap-lime text-black border-black/80'
      : 'bg-wrap-plum text-white border-white/25'
  const button =
    tone === 'lime' ? 'bg-black text-white' : 'bg-white text-black'
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-3 min-h-[118px] ${box}`}
    >
      <div>
        <div className="font-display text-sm font-bold leading-tight">{headline}</div>
        <div className="text-[10px] opacity-80 mt-1 leading-snug">{subcopy}</div>
      </div>
      <button
        type="button"
        onClick={(e) => window.open(url, '_blank')}
        className={`mt-2 rounded-full py-1.5 text-xs font-display font-bold active:scale-[0.98] transition ${button}`}
      >
        {cta} →
      </button>
    </div>
  )
}
