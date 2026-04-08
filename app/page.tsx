"use client"

import { useState, useEffect, Component, type ReactNode } from "react"
import { PromptForm } from "@/components/prompt-form"
import { MockupResult } from "@/components/mockup-result"
import { EmptyState } from "@/components/empty-state"
import { PromptHistory, HistoryItem } from "@/components/prompt-history"
import { WaveLoader } from "@/components/wave-loader"
import { Clock, X } from "lucide-react"
import { generateImage, ImageModel, ImageSize, QUALITY_SUPPORT, SIZE_SUPPORT } from "@/lib/generateImage"

const SETTINGS_KEY = "mockify_settings"

interface MockupData {
  imageUrl: string
  prompt: string
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-sm font-medium text-foreground">Something went wrong.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState<ImageModel>("dall-e-3")
  const [quality, setQuality] = useState<string>("standard")
  const [size, setSize] = useState<ImageSize>("1024x1024")

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY)
      if (savedSettings) {
        const { model: m, quality: q, size: s } = JSON.parse(savedSettings)
        if (m) setModel(m)
        if (q) setQuality(q)
        if (s) setSize(s)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ model, quality, size }))
  }, [model, quality, size])

  const handleGenerate = async (prompt: string, selectedSize: ImageSize) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const qualitySupported = QUALITY_SUPPORT[model]
      const opts: any = { model, size: selectedSize }
      if (qualitySupported) {
        opts.quality = quality as "low" | "medium" | "high" | "hd" | "standard"
      }

      const imageUrl = await generateImage(prompt, opts)
      setCurrent({ imageUrl, prompt })

      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          prompt,
          model,
          imageUrl,
          timestamp: new Date(),
        },
        ...prev.slice(0, 19),
      ])
    } catch (err) {
      console.error("Generation failed:", err)
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
    setModel(item.model as ImageModel)
    setShowHistory(false)
  }

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((i) => i.id !== id))
  }

  const handleClearHistory = () => setHistory([])

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="Mockify" className="h-7 w-7" />
            <span className="font-mono text-sm font-semibold text-foreground tracking-tight">
              Mockify
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
              AI Image Generator
            </span>
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
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

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
        {showHistory ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Session History</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {history.length} image{history.length !== 1 ? "s" : ""} this session
                </p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
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
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Hero */}
            {!current && !isLoading && (
              <div className="text-center pt-4 sm:pt-8 pb-2 sm:pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-balance text-foreground tracking-tight mb-2">
                  Generate AI Images
                  <br />
                  <span className="text-accent font-normal">with Mockify</span>
                </h1>
                <p className="text-sm text-muted-foreground font-mono max-w-md mx-auto leading-relaxed">
                  Describe any image  mockup, product, scene  and get a
                  photorealistic result in seconds. No API key needed.
                </p>
              </div>
            )}

            {/* Prompt form */}
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

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground font-mono wrap-break-word">
                <span className="mr-2 text-destructive">Error:</span>{error}
              </div>
            )}

            {/* Loading wave */}
            {isLoading && <WaveLoader />}

            {/* Result */}
            {current && !isLoading && (
              <MockupResult imageUrl={current.imageUrl} prompt={current.prompt} />
            )}

            {/* Empty state */}
            {!current && !isLoading && !error && <EmptyState />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6 text-center text-xs font-mono text-muted-foreground">
        © 2025 Mockify ·{" "}
        <a
          href="https://developer.puter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Built with Puter.js
        </a>{" "}
        · No API keys needed
      </footer>
    </div>
  )
}
