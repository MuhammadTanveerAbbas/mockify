"use client"

const G = "var(--gem-green)"
const G15 = "oklch(0.5 0.24 293 / 0.15)"
const G25 = "oklch(0.5 0.24 293 / 0.25)"
const G08 = "oklch(0.5 0.24 293 / 0.08)"

const BAR_COUNT = 40

const STATUS_MESSAGES = [
  "Analyzing prompt…",
  "Composing layout…",
  "Rendering components…",
  "Applying styles…",
  "Finalizing mockup…",
]

// Fixed positions so they're stable between server/client renders
const DOTS = [
  { x: "18%", y: "22%", delay: "0s",    dur: "2.8s" },
  { x: "75%", y: "15%", delay: "0.5s",  dur: "3.2s" },
  { x: "88%", y: "60%", delay: "1.1s",  dur: "2.5s" },
  { x: "12%", y: "70%", delay: "0.3s",  dur: "3.6s" },
  { x: "55%", y: "82%", delay: "0.9s",  dur: "2.9s" },
  { x: "40%", y: "10%", delay: "1.4s",  dur: "3.1s" },
  { x: "65%", y: "75%", delay: "0.7s",  dur: "2.7s" },
  { x: "30%", y: "48%", delay: "1.8s",  dur: "3.4s" },
]

// SVG waveform path (two cycles across 500px width)
const WAVE_D = "M0,30 C30,30 40,5 60,5 C80,5 90,55 110,55 C130,55 140,5 160,5 C180,5 190,55 210,55 C230,55 240,5 260,5 C280,5 290,55 310,55 C330,55 340,5 360,5 C380,5 390,55 410,55 C430,55 440,5 460,5 C480,5 490,30 500,30"

export function WaveLoader() {
  return (
    <div className="relative flex flex-col gap-4 animate-in fade-in duration-500">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Pulsing dot */}
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: G, animation: "orbit 1s ease-in-out infinite" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: G }}
            />
          </span>
          <span className="text-xs font-mono" style={{ color: G }}>
            Generating with SeedDream v4.5
          </span>
        </div>
        {/* Cycling status */}
        <div className="relative h-4 w-28 sm:w-32 overflow-hidden">
          {STATUS_MESSAGES.map((msg, i) => (
            <span
              key={msg}
              className="absolute right-0 text-xs font-mono whitespace-nowrap"
              style={{
                color: G25,
                animation: `status-cycle ${STATUS_MESSAGES.length * 1.8}s linear infinite`,
                animationDelay: `${i * 1.8}s`,
              }}
            >
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Main animation area */}
      <div
        className="relative overflow-hidden rounded-xl border"
        style={{
          borderColor: G25,
          background: "oklch(0.09 0 0)",
          minHeight: "clamp(220px, 40vw, 340px)",
        }}
      >
        {/* Deep radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 55%, oklch(0.5 0.24 293 / 0.13) 0%, transparent 70%)`,
            animation: "glow-pulse 3s ease-in-out infinite",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${G25} 1px, transparent 1px), linear-gradient(90deg, ${G25} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${G}, transparent)`,
            animation: "scan-line 2.6s linear infinite",
            boxShadow: `0 0 8px 1px ${G}`,
          }}
        />

        {/* Horizontal shimmer sweep */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${G08} 40%, oklch(0.5 0.24 293 / 0.14) 50%, ${G08} 60%, transparent 100%)`,
            animation: "wave-shift 2.2s ease-in-out infinite",
          }}
        />

        {/* Floating dots */}
        {DOTS.map((d, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: d.x,
              top: d.y,
              width: 4,
              height: 4,
              background: G,
              boxShadow: `0 0 8px 2px ${G}`,
              animation: `float-dot ${d.dur} ease-in-out infinite`,
              animationDelay: d.delay,
            }}
          />
        ))}

        {/* Corner brackets */}
        {[
          { top: 12, left: 12,  borderTop: `2px solid ${G}`, borderLeft:  `2px solid ${G}`, delay: "0s"    },
          { top: 12, right: 12, borderTop: `2px solid ${G}`, borderRight: `2px solid ${G}`, delay: "0.4s"  },
          { bottom: 12, left: 12,  borderBottom: `2px solid ${G}`, borderLeft:  `2px solid ${G}`, delay: "0.8s"  },
          { bottom: 12, right: 12, borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}`, delay: "1.2s"  },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              ...s,
              width: 16,
              height: 16,
              animation: `corner-ping 2s ease-in-out infinite`,
              animationDelay: s.delay,
            }}
          />
        ))}

        {/* Center stage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">

          {/* Orbit rings + center icon */}
          <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
            {/* Outer ring */}
            <div
              className="absolute rounded-full border"
              style={{
                width: 80, height: 80,
                borderColor: G25,
                borderTopColor: G,
                animation: "orbit 2s linear infinite",
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute rounded-full border"
              style={{
                width: 52, height: 52,
                borderColor: G15,
                borderBottomColor: G,
                animation: "orbit-reverse 1.4s linear infinite",
              }}
            />
            {/* Center dot */}
            <div
              className="absolute rounded-full"
              style={{
                width: 12, height: 12,
                background: G,
                boxShadow: `0 0 16px 4px ${G}, 0 0 4px 1px ${G}`,
                animation: "glow-pulse 1.6s ease-in-out infinite",
              }}
            />
          </div>

          {/* Travelling waveform */}
          <svg
            width="100%"
            height="60"
            viewBox="0 0 500 60"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: "visible", maxWidth: 300 }}
          >
            {/* Shadow waveform */}
            <path
              d={WAVE_D}
              stroke={G15}
              strokeWidth="2"
              fill="none"
            />
            {/* Animated travelling wave */}
            <path
              d={WAVE_D}
              stroke={G}
              strokeWidth="2"
              fill="none"
              strokeDasharray="120 480"
              style={{
                filter: `drop-shadow(0 0 6px ${G})`,
                animation: "waveform-travel 1.6s linear infinite",
              }}
            />
          </svg>

          {/* Equalizer bars */}
          <div className="flex items-end gap-0.5" style={{ height: 48 }}>
            {Array.from({ length: BAR_COUNT }).map((_, i) => {
              const delay = (i / BAR_COUNT) * 1.1
              const maxH = 10 + Math.round(Math.sin((i / BAR_COUNT) * Math.PI) * 38)
              return (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    height: maxH,
                    background: `oklch(0.5 0.24 293 / ${0.5 + Math.sin((i / BAR_COUNT) * Math.PI) * 0.5})`,
                    boxShadow: `0 0 4px ${G}`,
                    transformOrigin: "bottom",
                    animation: "wave-bar 1s ease-in-out infinite",
                    animationDelay: `${delay.toFixed(2)}s`,
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Bottom label */}
        <span
          className="absolute bottom-4 left-0 right-0 text-center text-xs font-mono tracking-[0.2em] uppercase"
          style={{ color: G25 }}
        >
          Rendering mockup  please wait
        </span>
      </div>

      {/* Footer skeleton lines */}
      <div className="flex gap-2">
        <div className="h-3 w-1/3 rounded-full bg-secondary animate-pulse" />
        <div className="h-3 w-1/5 rounded-full bg-secondary animate-pulse" style={{ animationDelay: "0.2s" }} />
      </div>
    </div>
  )
}
