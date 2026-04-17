import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  durationMs?: number
  format?: (n: number) => string
  className?: string
}

export function AnimatedNumber({ value, durationMs = 1200, format, className }: Props) {
  const [display, setDisplay] = useState(0)
  const displayRef = useRef(0)
  const start = useRef<number | null>(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const from = displayRef.current
    start.current = null
    const tick = (t: number) => {
      if (start.current == null) start.current = t
      const p = Math.min(1, (t - start.current) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      const next = from + (value - from) * eased
      displayRef.current = next
      setDisplay(next)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, durationMs])

  return <span className={className}>{format ? format(display) : Math.round(display)}</span>
}
