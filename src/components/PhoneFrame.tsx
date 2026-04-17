import type { ReactNode } from 'react'

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
      <div
        className="relative w-full h-full sm:h-[844px] sm:max-h-[90vh] sm:w-[390px] sm:rounded-[44px] sm:border sm:border-neutral-800 sm:shadow-2xl overflow-hidden bg-black"
        style={{ aspectRatio: 'auto' }}
      >
        <div className="absolute inset-0 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
