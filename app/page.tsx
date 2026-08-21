"use client"

import { useState, useCallback, useRef, Component, type ReactNode } from "react"
import { PromptForm } from "@/components/prompt-form"
import { MockupResult } from "@/components/mockup-result"
import { EmptyState } from "@/components/empty-state"
import { PromptHistory, HistoryItem } from "@/components/prompt-history"
import { WaveLoader } from "@/components/wave-loader"
import { useLocalStorageItem } from "@/lib/use-local-storage"
import { Clock, X } from "lucide-react"
import {
  generateImage,
  normalizeModel,
  normalizeSize,
  ImageModel,
  Quality,
  SizeValue,
  QUALITY_SUPPORT,
  SIZE_SUPPORT,
  type GenerateImageOptions,
} from "@/lib/generateImage"

const SETTINGS_KEY = "mockify_settings"
const HISTORY_KEY = "mockify_history"
const MAX_HISTORY = 20

interface MockupData {
  imageUrl: string
  prompt: string
}

interface StoredHistoryItem {
  id: string
  prompt: string
  model: string
  imageUrl: string
  timestamp: string
}

interface AppSettings {
  model: ImageModel
  quality: Quality
  size: SizeValue
}

const DEFAULT_SETTINGS: AppSettings = {
  model: "auto",
  quality: "medium",
  size: "square",
}

async function persistableImageUrl(url: string): Promise<string> {
  if (!url.startsWith("blob:")) return url
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function parseHistory(raw: string): HistoryItem[] {
  const parsed = JSON.parse(raw) as StoredHistoryItem[]
  if (!Array.isArray(parsed)) return []
  return parsed
    .filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.prompt === "string" &&
        typeof item.imageUrl === "string"
    )
    .map((item) => ({
      id: item.id,
      prompt: item.prompt,
      model: item.model ?? "auto",
      imageUrl: item.imageUrl,
      timestamp: new Date(item.timestamp),
    }))
    .slice(0, MAX_HISTORY)
}

function serializeHistory(items: HistoryItem[]): string {
  const stored: StoredHistoryItem[] = items.map((item) => ({
    id: item.id,
    prompt: item.prompt,
    model: item.model,
    imageUrl: item.imageUrl,
    timestamp: item.timestamp.toISOString(),
  }))
  return JSON.stringify(stored)
}

function parseSettings(raw: string): AppSettings {
  const parsed = JSON.parse(raw) as Partial<AppSettings>
  // normalizeModel/normalizeSize migrate legacy IDs and reject unknown values
  const model = normalizeModel(parsed.model)
  const size = normalizeSize(parsed.size)
  const allowedSizes = SIZE_SUPPORT[model]
  const safeSize = allowedSizes && !allowedSizes.includes(size) ? "square" : size
  const supportedQualities = QUALITY_SUPPORT[model]
  const quality =
    supportedQualities && !supportedQualities.includes(parsed.quality as Quality)
      ? DEFAULT_SETTINGS.quality
      : (parsed.quality ?? DEFAULT_SETTINGS.quality)
  return { model, quality, size: safeSize }
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-sm font-medium text-foreground">Something went wrong.</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="min-h-11 rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Home() {
  const [current, setCurrent] = useState<MockupData | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [settings, setSettings] = useLocalStorageItem(
    SETTINGS_KEY,
    DEFAULT_SETTINGS,
    parseSettings,
    JSON.stringify
  )
  const { model, quality, size } = settings

  const lastAttempt = useRef<{ prompt: string; size: SizeValue } | null>(null)
  const [canRetry, setCanRetry] = useState(false)

  const [history, setHistory] = useLocalStorageItem<HistoryItem[]>(
    HISTORY_KEY,
    [],
    parseHistory,
    serializeHistory
  )

  const setModel = useCallback(
    (next: ImageModel) =>
      setSettings((prev) => {
        // Keep quality/size valid for the newly selected model
        const supportedQualities = QUALITY_SUPPORT[next]
        const quality =
          supportedQualities && !supportedQualities.includes(prev.quality)
            ? DEFAULT_SETTINGS.quality
            : prev.quality
        const allowedSizes = SIZE_SUPPORT[next]
        const size = allowedSizes && !allowedSizes.includes(prev.size) ? "square" : prev.size
        return { ...prev, model: next, quality, size }
      }),
    [setSettings]
  )
  const setQuality = useCallback(
    (next: Quality) => setSettings((prev) => ({ ...prev, quality: next })),
    [setSettings]
  )
  const setSize = useCallback(
    (next: SizeValue) => setSettings((prev) => ({ ...prev, size: next })),
    [setSettings]
  )

  const handleGenerate = async (prompt: string, selectedSize: SizeValue) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.")
      return
    }

    setIsLoading(true)
    setError(null)
    lastAttempt.current = { prompt, size: selectedSize }
    setCanRetry(true)

    try {
      const opts: GenerateImageOptions = { model, size: selectedSize }
      // generateImage only sends quality when the model supports it
      if (QUALITY_SUPPORT[model]) {
        opts.quality = quality
      }

      const imageUrl = await generateImage(prompt, opts)
      const storableUrl = await persistableImageUrl(imageUrl)
      setCurrent({ imageUrl: storableUrl, prompt })

      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          prompt,
          model,
          imageUrl: storableUrl,
          timestamp: new Date(),
        },
        ...prev.slice(0, MAX_HISTORY - 1),
      ])
    } catch (err) {
      let msg = "Image generation failed. Please try again or switch models."
      if (err instanceof Error) {
        msg = err.message
      } else if (err && typeof err === "object") {
        const e = err as Record<string, unknown>
        msg = (e.message as string) || (e.error as string) || JSON.stringify(err)
      }
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrent({ imageUrl: item.imageUrl, prompt: item.prompt })
    setModel(normalizeModel(item.model))
    setShowHistory(false)
  }

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((i) => i.id !== id))
  }

  const handleClearHistory = () => setHistory([])

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <img src="/favicon.svg" alt="Mockify" className="h-7 w-7 shrink-0" />
            <span className="font-mono text-sm font-semibold text-foreground tracking-tight truncate">
              Mockify
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-mono text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
              AI Image Generator
            </span>
            <button
              type="button"
              onClick={() => setShowHistory((v) => !v)}
              aria-expanded={showHistory}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              {showHistory ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  Close
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  History
                  {history.length > 0 && (
                    <span className="ml-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                      {history.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8 w-full">
        {showHistory ? (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-foreground">Generation History</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {history.length} saved image{history.length !== 1 ? "s" : ""} in this browser
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="min-h-11 shrink-0 px-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </div>
            <PromptHistory
              items={history}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
              onClearAll={handleClearHistory}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {!current && !isLoading && (
              <div className="relative text-center pt-6 sm:pt-10 pb-2 sm:pb-4">
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 sm:w-96 -translate-x-1/2 rounded-full blur-3xl"
                  style={{ background: "oklch(0.5 0.24 293 / 0.12)" }}
                />
                <h1 className="relative text-2xl sm:text-3xl lg:text-4xl font-semibold text-balance text-foreground tracking-tight mb-2">
                  Generate AI Images
                  <br />
                  <span className="text-accent font-normal">with Mockify</span>
                </h1>
                <p className="relative text-sm text-muted-foreground font-mono max-w-md mx-auto leading-relaxed px-2">
                  Describe a mockup, product, or scene and generate an image in your browser.
                  Powered by Pollinations.ai, free and open. No API keys, no sign-up.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <ErrorBoundary>
                <PromptForm
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  model={model}
                  quality={quality}
                  size={size}
                  onModelChange={setModel}
                  onQualityChange={setQuality}
                  onSizeChange={setSize}
                />
              </ErrorBoundary>
            </div>

            {error && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
                <p className="min-w-0 flex-1 text-sm text-destructive-foreground font-mono wrap-break-word">
                  <span className="mr-2 text-destructive">Couldn&apos;t generate:</span>
                  {error}
                </p>
                {canRetry && !isLoading && (
                  <button
                    type="button"
                    onClick={() => {
                      if (lastAttempt.current) handleGenerate(lastAttempt.current.prompt, lastAttempt.current.size)
                    }}
                    className="shrink-0 min-h-9 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-mono text-foreground hover:bg-destructive/20 transition-colors"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}

            {isLoading && <WaveLoader />}

            {current && !isLoading && (
              <MockupResult imageUrl={current.imageUrl} prompt={current.prompt} />
            )}

            {!current && !isLoading && !error && <EmptyState />}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-6 px-4 text-center text-xs font-mono text-muted-foreground">
        © {new Date().getFullYear()} Mockify,{" "}
        <a
          href="https://pollinations.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Powered by Pollinations.ai
        </a>
      </footer>
    </div>
  )
}
