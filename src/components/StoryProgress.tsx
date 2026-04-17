export function StoryProgress({
  total,
  index,
  progress,
  onJump,
}: {
  total: number
  index: number
  progress: number
  onJump: (i: number) => void
}) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-3">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < index ? 1 : i === index ? progress : 0
        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
          >
            <div
              className="h-full bg-white"
              style={{
                width: `${filled * 100}%`,
                transition: i === index ? 'none' : 'width 200ms linear',
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
