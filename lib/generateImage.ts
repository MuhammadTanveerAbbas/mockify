export type ImageModel = "auto" | "flux" | "turbo"

export type Quality = "low" | "medium" | "high" | "auto"

export type SizeValue = "square" | "landscape" | "portrait" | "widescreen"

export interface GenerateImageOptions {
  model?: ImageModel
  quality?: Quality
  size?: SizeValue
}

/** Known-good model used as the first fallback when the requested model fails */
const FALLBACK_MODEL: ImageModel = "flux"

/** Map deprecated/renamed model IDs to a currently valid one */
const LEGACY_MODEL_MAP: Record<string, ImageModel> = {
  "dall-e-3": "flux",
  "dall-e-2": "flux",
  "gpt-image-1": "flux",
  "gpt-image-1-mini": "turbo",
  "black-forest-labs/FLUX.1.1-pro": "flux",
  "black-forest-labs/FLUX.1-pro": "flux",
  "black-forest-labs/FLUX.1-schnell": "turbo",
  "black-forest-labs/flux-2-pro": "flux",
  "black-forest-labs/flux-1.1-pro": "flux",
  "gemini-2.5-flash-image-preview": "flux",
  "google/gemini-2.5-flash-image": "flux",
  "google/gemini-3-pro-image-preview": "flux",
  "google/imagen-4.0-ultra": "flux",
  "x-ai/grok-imagine-image": "turbo",
  "bytedance-seed/seedream-4.0": "flux",
  "ideogram/ideogram-3.0": "flux",
}

const VALID_MODELS = new Set<string>(["auto", "flux", "turbo"])

const VALID_SIZES = new Set<string>(["square", "landscape", "portrait", "widescreen"])

/** Resolve a stored/user-provided model ID to a currently valid one */
export function normalizeModel(value: unknown): ImageModel {
  if (typeof value === "string") {
    if (VALID_MODELS.has(value)) return value as ImageModel
    if (LEGACY_MODEL_MAP[value]) return LEGACY_MODEL_MAP[value]
  }
  return "auto"
}

/** Resolve a stored/user-provided size to a currently valid one */
export function normalizeSize(value: unknown): SizeValue {
  if (typeof value === "string") {
    if (VALID_SIZES.has(value)) return value as SizeValue
  }
  return "square"
}

/**
 * Enhances the user prompt with quality and composition keywords
 * to ensure full, complete images without cutoffs
 */
function enhancePrompt(prompt: string, size: SizeValue): string {
  const aspectRatio =
    size === "portrait" ? "portrait" : size === "landscape" || size === "widescreen" ? "landscape" : "square"

  const qualityKeywords = [
    "high quality",
    "detailed",
    "professional",
    "complete composition",
    "full frame",
    "no cropping",
    "centered",
    "well-composed",
  ]

  const hasQualityKeywords = qualityKeywords.some((keyword) => prompt.toLowerCase().includes(keyword))

  let enhanced = prompt.trim()

  if (!enhanced.toLowerCase().includes("full") && !enhanced.toLowerCase().includes("complete")) {
    enhanced = `Complete ${aspectRatio} composition: ${enhanced}`
  }

  if (!hasQualityKeywords) {
    enhanced += ", high quality, detailed, professional photography, full frame, centered composition, no cropping"
  }

  return enhanced
}

interface GenerationRequest {
  label: string
  payload: {
    prompt: string
    model: string
    width: number
    height: number
    seed: number
  }
}

const GENERATION_TIMEOUT_MS = 90_000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(url: string, timeoutMs: number, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** Confirms the returned image actually loads before treating the attempt as successful */
function verifyImageLoads(src: string, timeoutMs = 30_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const timer = setTimeout(() => {
      img.src = ""
      reject(new Error("Generated image failed to load."))
    }, timeoutMs)
    img.onload = () => {
      clearTimeout(timer)
      resolve()
    }
    img.onerror = () => {
      clearTimeout(timer)
      reject(new Error("Generated image failed to load."))
    }
    img.src = src
  })
}

function buildRequest(enhancedPrompt: string, model: ImageModel, size: SizeValue, seed: number): GenerationRequest {
  // "auto" uses Pollinations' default model (flux)
  const resolvedModel = model === "auto" ? "flux" : model
  const sizeOption = SIZE_OPTIONS.find((s) => s.value === size) ?? SIZE_OPTIONS[0]

  return {
    label: model === "auto" ? "Auto" : resolvedModel,
    payload: {
      prompt: enhancedPrompt,
      model: resolvedModel,
      width: sizeOption.width,
      height: sizeOption.height,
      seed,
    },
  }
}

function extractRawMessage(err: unknown): string | undefined {
  if (err instanceof Error && err.message) return err.message
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>
    const message = (e.message as string) || (e.error as string)
    if (typeof message === "string" && message) return message
  }
  if (typeof err === "string" && err) return err
  return undefined
}

/**
 * Builds the final user-facing error from every failed attempt.
 * Reports the real cause instead of guessing.
 */
function summarizeErrors(errors: unknown[]): Error {
  const messages = errors.map(extractRawMessage).filter((m): m is string => Boolean(m))
  const joined = messages.join(" | ")

  if (/queue full|rate.?limit|too many|429/i.test(joined)) {
    return new Error(
      "The free generation service is busy right now. Please wait about 15 seconds and try again."
    )
  }
  if (/timeout|timed out|abort/i.test(joined)) {
    return new Error("Image generation timed out. Please try again.")
  }

  const last = messages[messages.length - 1]
  if (last) {
    return new Error(`Couldn't generate an image (${last}). Please try again.`)
  }
  return new Error("Image generation failed. Please try again.")
}

async function requestImage(request: GenerationRequest): Promise<string> {
  // Routed through /api/generate because the upstream service blocks
  // browser requests that carry an Origin header (HTTP 403).
  let response: Response
  try {
    response = await fetchWithTimeout("/api/generate", GENERATION_TIMEOUT_MS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.payload),
    })
  } catch (err) {
    throw new Error(extractRawMessage(err) ?? "Network error while generating image.")
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`
    try {
      const data = (await response.json()) as { error?: string }
      if (data.error) detail = data.error
    } catch {
      /* keep status-code detail */
    }
    const retryAfter = response.headers.get("retry-after")
    const err = new Error(retryAfter ? `${detail} Retry after ${retryAfter}s.` : detail)
    ;(err as Error & { status?: number }).status = response.status
    throw err
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  await verifyImageLoads(objectUrl)
  return objectUrl
}

/**
 * Generates an image via the free Pollinations.ai API (no key, no signup),
 * routed through /api/generate to avoid browser Origin blocking.
 *
 * Reliability behavior:
 * - Tries the requested model first, then a known-good default, then turbo.
 * - Rate limits (HTTP 429/402) respect Retry-After when provided, otherwise
 *   use jittered backoff between attempts.
 * - Bounded retries only; surfaces the real cause when everything fails.
 */
export async function generateImage(prompt: string, options: GenerateImageOptions = {}): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Must be called in a browser context.")
  }

  const model = options.model ?? "auto"
  const size = options.size ?? "square"
  const seed = Math.floor(Math.random() * 1_000_000_000)
  const enhancedPrompt = enhancePrompt(prompt, size)

  // Fallback chain: requested model -> flux -> turbo
  const attempts: GenerationRequest[] = []
  if (model !== "auto") {
    attempts.push(buildRequest(enhancedPrompt, model, size, seed))
    if (model !== FALLBACK_MODEL) {
      attempts.push(buildRequest(enhancedPrompt, FALLBACK_MODEL, size, seed))
    }
  }
  attempts.push(buildRequest(enhancedPrompt, "turbo", size, seed))

  const errors: unknown[] = []
  for (let i = 0; i < attempts.length; i++) {
    try {
      return await requestImage(attempts[i])
    } catch (err) {
      errors.push(err)

      if (i < attempts.length - 1) {
        // Respect Retry-After when the server sent one, else jittered backoff
        const raw = extractRawMessage(err) ?? ""
        const match = raw.match(/retry after (\d+)s/i)
        const waitMs = match
          ? Number(match[1]) * 1000
          : 1500 + Math.random() * 1500
        await sleep(Math.min(waitMs, 15_000))
      }
    }
  }

  throw summarizeErrors(errors)
}

export const MODEL_OPTIONS: { label: string; value: ImageModel; description: string }[] = [
  { label: "Auto", value: "auto", description: "Uses the best default model automatically" },
  { label: "Flux", value: "flux", description: "Photorealistic default model with strong detail" },
  { label: "Turbo", value: "turbo", description: "Fastest generation, great for quick drafts" },
]

/** Models that support quality selection and their allowed values */
export const QUALITY_SUPPORT: Record<string, Quality[]> = {}

export const SIZE_OPTIONS: {
  label: string
  value: SizeValue
  ratio: string
  icon: string
  width: number
  height: number
}[] = [
  { label: "Square", value: "square", ratio: "1:1", icon: "Square", width: 1024, height: 1024 },
  { label: "Landscape", value: "landscape", ratio: "3:2", icon: "RectangleHorizontal", width: 1248, height: 832 },
  { label: "Portrait", value: "portrait", ratio: "2:3", icon: "RectangleVertical", width: 832, height: 1248 },
  { label: "Widescreen", value: "widescreen", ratio: "16:9", icon: "Monitor", width: 1280, height: 720 },
]

/** Sizes supported per model; models missing from this list support all sizes */
export const SIZE_SUPPORT: Record<string, SizeValue[]> = {}
