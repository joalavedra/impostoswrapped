import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  index: number
  count: number
  onPrev: () => void
  onNext: () => void
  autoAdvanceMs?: number
  paused?: boolean
  onProgress?: (p: number) => void
  children: ReactNode
}

export function SwipeContainer({
  index,
  count,
  onPrev,
  onNext,
  autoAdvanceMs,
  paused,
  onProgress,
  children,
}: Props) {
  const [pressing, setPressing] = useState(false)
  const startX = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!autoAdvanceMs || pressing || paused) return
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / autoAdvanceMs)
      onProgress?.(p)
      if (p >= 1) {
        if (index < count - 1) onNext()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [index, autoAdvanceMs, pressing, paused, count, onNext, onProgress])

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width * 0.33) onPrev()
    else onNext()
  }

  return (
    <div
      className="absolute inset-0"
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={(e) => {
        setPressing(true)
        startX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        setPressing(false)
        if (startX.current != null) {
          const dx = e.changedTouches[0].clientX - startX.current
          if (Math.abs(dx) > 50) {
            if (dx < 0) onNext()
            else onPrev()
            startX.current = null
            return
          }
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
          const x = e.changedTouches[0].clientX - rect.left
          if (x < rect.width * 0.33) onPrev()
          else onNext()
        }
        startX.current = null
      }}
      onClick={(e) => {
        if ('ontouchstart' in window) return
        handleTap(e)
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
