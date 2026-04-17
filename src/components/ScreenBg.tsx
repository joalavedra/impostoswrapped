import type { ReactNode } from 'react'

export type BgVariant =
  | 'cream-waves'
  | 'coral-dots'
  | 'lime-stripes'
  | 'plum-grid'
  | 'dark-grid'
  | 'coral-grid'
  | 'lime-dots'
  | 'plum-stripes'

interface Variant {
  bg: string
  text: 'text-black' | 'text-white'
  pattern: string
  patternSize: string
  patternOpacity: number
}

const PATTERNS = {
  dots: (color: string) =>
    `radial-gradient(circle at 1.5px 1.5px, ${color} 1.5px, transparent 1.5px)`,
  stripes: (color: string) =>
    `repeating-linear-gradient(45deg, transparent 0 10px, ${color} 10px 12px)`,
  grid: (color: string) =>
    `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
  waves: (color: string) =>
    `radial-gradient(circle at 50% 100%, ${color} 14px, transparent 15px)`,
}

const INK_DARK = 'rgba(0,0,0,0.16)'
const INK_LIGHT = 'rgba(255,255,255,0.18)'

const VARIANTS: Record<BgVariant, Variant> = {
  'cream-waves': {
    bg: '#f7efe2',
    text: 'text-black',
    pattern: PATTERNS.waves(INK_DARK),
    patternSize: '28px 28px',
    patternOpacity: 0.9,
  },
  'coral-dots': {
    bg: '#ff5a5f',
    text: 'text-white',
    pattern: PATTERNS.dots(INK_LIGHT),
    patternSize: '18px 18px',
    patternOpacity: 1,
  },
  'coral-grid': {
    bg: '#ff5a5f',
    text: 'text-white',
    pattern: PATTERNS.grid(INK_LIGHT),
    patternSize: '22px 22px',
    patternOpacity: 1,
  },
  'lime-stripes': {
    bg: '#c9ff4d',
    text: 'text-black',
    pattern: PATTERNS.stripes(INK_DARK),
    patternSize: 'auto',
    patternOpacity: 1,
  },
  'lime-dots': {
    bg: '#c9ff4d',
    text: 'text-black',
    pattern: PATTERNS.dots(INK_DARK),
    patternSize: '18px 18px',
    patternOpacity: 1,
  },
  'plum-grid': {
    bg: '#6b2dd1',
    text: 'text-white',
    pattern: PATTERNS.grid(INK_LIGHT),
    patternSize: '22px 22px',
    patternOpacity: 1,
  },
  'plum-stripes': {
    bg: '#6b2dd1',
    text: 'text-white',
    pattern: PATTERNS.stripes(INK_LIGHT),
    patternSize: 'auto',
    patternOpacity: 1,
  },
  'dark-grid': {
    bg: '#0b0b10',
    text: 'text-white',
    pattern: PATTERNS.grid(INK_LIGHT),
    patternSize: '22px 22px',
    patternOpacity: 1,
  },
}

interface Props {
  variant: BgVariant
  children: ReactNode
}

export function ScreenBg({ variant, children }: Props) {
  const v = VARIANTS[variant]
  return (
    <div
      className={`absolute inset-0 flex flex-col px-5 pt-14 pb-8 ${v.text}`}
      style={{ backgroundColor: v.bg }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: v.pattern,
          backgroundSize: v.patternSize,
          opacity: v.patternOpacity,
        }}
      />
      <div className="relative flex flex-1 flex-col min-h-0">{children}</div>
    </div>
  )
}
