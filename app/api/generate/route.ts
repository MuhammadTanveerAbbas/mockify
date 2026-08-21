import type { NextRequest } from "next/server"

const UPSTREAM_TIMEOUT_MS = 90_000
const ALLOWED_MODELS = new Set(["flux", "turbo"])

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Thin proxy around the free Pollinations.ai image API.
 * The upstream service blocks browser requests that carry an Origin header,
 * so generation is routed through this server-side endpoint instead.
 */
export async function POST(req: NextRequest) {
  let body: { prompt?: unknown; model?: unknown; width?: unknown; height?: unknown; seed?: unknown }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : ""
  if (!prompt) {
    return Response.json({ error: "Prompt is required." }, { status: 400 })
  }

  const model = typeof body.model === "string" && ALLOWED_MODELS.has(body.model) ? body.model : "flux"
  const width = clamp(typeof body.width === "number" && Number.isFinite(body.width) ? Math.round(body.width) : 1024, 256, 1536)
  const height = clamp(typeof body.height === "number" && Number.isFinite(body.height) ? Math.round(body.height) : 1024, 256, 1536)
  const seed =
    typeof body.seed === "number" && Number.isFinite(body.seed)
      ? clamp(Math.round(body.seed), 0, 999_999_999)
      : Math.floor(Math.random() * 1_000_000_000)

  const params = new URLSearchParams({
    model,
    width: String(width),
    height: String(height),
    seed: String(seed),
    nologo: "true",
    private: "true",
  })

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const upstream = await fetch(url, { signal: controller.signal })

    if (!upstream.ok || !upstream.body) {
      // Forward rate-limit info so the client can back off correctly
      const retryAfter = upstream.headers.get("retry-after")
      const headers: Record<string, string> = {}
      if (retryAfter) headers["Retry-After"] = retryAfter
      const status = upstream.status === 429 || upstream.status === 402 ? 429 : 502
      return Response.json(
        { error: `Image service returned ${upstream.status}.` },
        { status, headers }
      )
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return Response.json({ error: "Image service request failed or timed out." }, { status: 504 })
  } finally {
    clearTimeout(timer)
  }
}
