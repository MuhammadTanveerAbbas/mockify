"use client"

import { useState } from "react"
import { Loader2, Sparkles, Square, RectangleHorizontal, RectangleVertical, Maximize2, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageModel, MODEL_OPTIONS, QUALITY_SUPPORT, SIZE_OPTIONS, SIZE_SUPPORT, ImageSize } from "@/lib/generateImage"

const MAX_CHARS = 1000

const EXAMPLE_PROMPTS = [
  "Professional product photo of wireless headphones on clean white background, studio lighting",
  "Modern smartwatch displaying fitness dashboard, centered composition, high detail",
  "Premium skincare serum bottle with elegant packaging, full product shot, soft shadows",
  "Sleek electric scooter in urban setting, complete vehicle visible, photorealistic",
  "Designer sneakers with multiple colorways, product showcase, professional photography",
]

interface PromptFormProps {
  onGenerate: (prompt: string, size: ImageSize) => void
  isLoading: boolean
  model: ImageModel
  quality: string
  size: ImageSize
  onModelChange: (model: ImageModel) => void
  onQualityChange: (quality: string) => void
  onSizeChange: (size: ImageSize) => void
}

export function PromptForm({
  onGenerate,
  isLoading,
  model,
  quality,
  size,
  onModelChange,
  onQualityChange,
  onSizeChange,
}: PromptFormProps) {
  const [prompt, setPrompt] = useState("")
  const [promptError, setPromptError] = useState<string | null>(null)

  const qualityOptions = QUALITY_SUPPORT[model] ?? null
  const sizeOptions = SIZE_SUPPORT[model] ?? null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      setPromptError("Please enter a prompt.")
      return
    }
    setPromptError(null)
    onGenerate(prompt, size)
  }

  // Icon mapping
  const iconMap: Record<string, any> = {
    Square,
    RectangleHorizontal,
    RectangleVertical,
    Maximize2,
    Monitor,
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Prompt Textarea */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setPrompt(e.target.value)
            if (promptError && e.target.value.trim()) setPromptError(null)
          }}
          placeholder="Describe the image in detail: subject, composition, lighting, style..."
          rows={4}
          className={cn(
            "w-full resize-none rounded-lg border bg-muted px-4 py-3 pb-6",
            "h-28 font-sans text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-1 focus:ring-ring transition-colors leading-relaxed",
            promptError ? "border-destructive" : "border-border"
          )}
        />
        <span className="absolute bottom-2 right-3 text-[10px] font-mono text-muted-foreground/60">
          {prompt.length}/{MAX_CHARS}
        </span>
        {promptError && (
          <p className="mt-1 text-xs text-destructive font-mono">{promptError}</p>
        )}
      </div>

      {/* Model + Quality + Size selectors */}
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value as ImageModel)}
            className={cn(
              "rounded-lg border border-border bg-muted px-3 py-2",
              "text-sm text-foreground font-sans",
              "focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            )}
          >
            {MODEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} • {opt.badge}
              </option>
            ))}
          </select>
          {MODEL_OPTIONS.find((opt) => opt.value === model)?.description && (
            <p className="text-xs text-muted-foreground/70 font-mono mt-0.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-medium">
                {MODEL_OPTIONS.find((opt) => opt.value === model)?.badge}
              </span>
              {MODEL_OPTIONS.find((opt) => opt.value === model)?.description}
            </p>
          )}
        </div>

        {qualityOptions && (
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Quality
            </label>
            <select
              value={quality}
              onChange={(e) => onQualityChange(e.target.value)}
              className={cn(
                "rounded-lg border border-border bg-muted px-3 py-2",
                "text-sm text-foreground font-sans",
                "focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              )}
            >
              {qualityOptions.map((q) => (
                <option key={q} value={q}>
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Size/Aspect Ratio selector */}
      {sizeOptions && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Size & Aspect Ratio
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SIZE_OPTIONS.filter(opt => sizeOptions.includes(opt.value)).map((opt) => {
              const IconComponent = iconMap[opt.icon]
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onSizeChange(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border px-3 py-2.5 transition-all",
                    size === opt.value
                      ? "border-ring bg-accent/10 text-foreground"
                      : "border-border bg-muted text-muted-foreground hover:border-ring/50 hover:text-foreground"
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs font-medium">{opt.label}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{opt.ratio}</span>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground/70 font-mono">
            Selected: {size} • Full frame, no cropping
          </p>
        </div>
      )}

      {/* Example chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {EXAMPLE_PROMPTS.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setPrompt(ex)}
            className={cn(
              "shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground",
              "hover:border-ring hover:text-foreground transition-colors font-mono"
            )}
          >
            {ex.length > 36 ? ex.slice(0, 36) + "…" : ex}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-6 py-3",
          "bg-primary text-primary-foreground font-sans text-sm font-medium",
          "hover:opacity-90 active:opacity-80 transition-opacity",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate
          </>
        )}
      </button>
    </form>
  )
}
