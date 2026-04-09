"use client"

const G = "var(--gem-green)"
const G10 = "oklch(0.5 0.24 293 / 0.10)"
const G20 = "oklch(0.5 0.24 293 / 0.20)"
const G50 = "oklch(0.5 0.24 293 / 0.50)"

const BAR_COUNT = 28

const STATUS_MESSAGES = [
  "Reading your prompt…",
  "Thinking about composition…",
  "Choosing the right style…",
  "Painting pixels…",
  "Almost there…",
]

const TOTAL_DURATION = STATUS_MESSAGES.length * 2 // seconds

export function WaveLoader() {
  return (
    <div
      className="flex flex-col gap-5"
      style={{ animation: "fade-up 0.4s ease both" }}
    >
      {/* Top row — model label + cycling status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Three-dot pulse indicator */}
          <div className="flex items-center gap-1">
            {[0, 0.3, 0.6].map((delay, i) => (
              <span
                key={i}
                className="block rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  background: G,
                  animation: `dot-pulse 1.2s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </div>
          <span
            className="text-xs font-mono tracking-wide"
            style={{ color: G50 }}
          >
            mockify · generating
          </span>
        </div>

        {/* Cycling status text */}
        <div className="relative h-4 overflow-hidden" style={{ minWidth: 140 }}>
          {STATUS_MESSAGES.map((msg, i) => (
            <span
              key={msg}
              className="absolute right-0 text-xs font-mono whitespace-nowrap"
              style={{
                color: G20,
                animation: `status-fade ${TOTAL_DURATION}s linear infinite`,
                animationDelay: `${i * 2}s`,
              }}
            >
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Main card */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "oklch(0.10 0 0)",
          border: `1px solid ${G10}`,
          minHeight: "clamp(200px, 36vw, 300px)",
        }}
      >
        {/* Shimmer sweep */}
        <div
          className="absolute inset-y-0 pointer-events-none"
          style={{
            width: "25%",
            background: `linear-gradient(90deg, transparent, ${G10}, transparent)`,
            animation: "shimmer-x 2.4s ease-in-out infinite",
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">

          {/* Label */}
          <p
            className="text-xs font-mono tracking-[0.18em] uppercase"
            style={{ color: G20 }}
          >
            Generating your image
          </p>

          {/* Bar visualizer */}
          <div
            className="flex items-end gap-[3px]"
            style={{ height: 44 }}
          >
            {Array.from({ length: BAR_COUNT }).map((_, i) => {
              const envelope = Math.sin((i / (BAR_COUNT - 1)) * Math.PI)
              const maxH = Math.round(8 + envelope * 36)
              const delay = (i / BAR_COUNT) * 1.0
              const opacity = 0.35 + envelope * 0.65
              return (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    height: maxH,
                    background: G,
                    opacity,
                    transformOrigin: "bottom",
                    animation: `bar-scale 0.9s ease-in-out infinite`,
                    animationDelay: `${delay.toFixed(2)}s`,
                  }}
                />
              )
            })}
          </div>

          {/* Thin progress line */}
          <div
            className="relative overflow-hidden rounded-full"
            style={{ width: 120, height: 1, background: G10 }}
          >
            <div
              className="absolute inset-y-0"
              style={{
                width: "40%",
                background: `linear-gradient(90deg, transparent, ${G}, transparent)`,
                animation: "shimmer-x 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Skeleton footer */}
      <div className="flex gap-2">
        <div className="h-2.5 w-2/5 rounded-full bg-secondary animate-pulse" />
        <div
          className="h-2.5 w-1/5 rounded-full bg-secondary animate-pulse"
          style={{ animationDelay: "0.15s" }}
        />
      </div>
    </div>
  )
}
