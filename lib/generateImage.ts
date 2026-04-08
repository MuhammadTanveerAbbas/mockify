export type ImageModel =
  | "gpt-image-1"
  | "gpt-image-1-mini"
  | "dall-e-3"
  | "dall-e-2"
  | "gemini-2.5-flash-image-preview"
  | "black-forest-labs/FLUX.1-schnell"
  | "black-forest-labs/FLUX.1-pro"
  | "black-forest-labs/FLUX.1.1-pro"
  | "stabilityai/stable-diffusion-3-medium"
  | "stabilityai/stable-diffusion-xl-base-1.0"
  | "google/imagen-4.0-fast"
  | "google/imagen-4.0-ultra"
  | "ideogram/ideogram-3.0"

export type ImageSize = "1024x1024" | "1792x1024" | "1024x1792" | "1536x1536" | "1280x720"

export interface GenerateImageOptions {
  model?: ImageModel
  quality?: "low" | "medium" | "high" | "hd" | "standard"
  size?: ImageSize
  width?: number
  height?: number
}

/**
 * Enhances the user prompt with quality and composition keywords
 * to ensure full, complete images without cutoffs
 */
function enhancePrompt(prompt: string, size: ImageSize): string {
  const aspectRatio = size === "1024x1792" ? "portrait" : (size === "1792x1024" || size === "1280x720") ? "landscape" : "square"
  
  // Quality enhancement keywords
  const qualityKeywords = [
    "high quality",
    "detailed",
    "professional",
    "complete composition",
    "full frame",
    "no cropping",
    "centered",
    "well-composed"
  ]
  
  // Check if prompt already contains quality keywords
  const hasQualityKeywords = qualityKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  )
  
  // Build enhanced prompt
  let enhanced = prompt.trim()
  
  // Add composition guidance
  if (!enhanced.toLowerCase().includes("full") && !enhanced.toLowerCase().includes("complete")) {
    enhanced = `Complete ${aspectRatio} composition: ${enhanced}`
  }
  
  // Add quality keywords if not present
  if (!hasQualityKeywords) {
    enhanced += ", high quality, detailed, professional photography, full frame, centered composition, no cropping"
  }
  
  return enhanced
}

export async function generateImage(
  prompt: string,
  options: GenerateImageOptions = {}
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Must be called in a browser context.")
  }

  // Poll for puter to be ready (up to 10s)
  if (!window.puter) {
    await new Promise<void>((resolve, reject) => {
      const start = Date.now()
      const interval = setInterval(() => {
        if (window.puter) {
          clearInterval(interval)
          resolve()
        } else if (Date.now() - start > 10_000) {
          clearInterval(interval)
          reject(new Error("Puter.js failed to load. Please refresh the page."))
        }
      }, 200)
    })
  }

  // Enhance prompt for better quality and composition
  const size = options.size ?? "1024x1024"
  const enhancedPrompt = enhancePrompt(prompt, size)
  
  // Build generation options
  const generationOptions: any = {
    model: options.model ?? "dall-e-3",
    quality: options.quality ?? "medium",
  }
  
  // Add size parameters
  if (options.size) {
    generationOptions.size = options.size
  }
  if (options.width && options.height) {
    generationOptions.width = options.width
    generationOptions.height = options.height
  }

  const imgElement = await window.puter.ai.txt2img(enhancedPrompt, generationOptions)

  // imgElement is an HTMLImageElement  wait for it to fully load
  // then convert to a blob URL so it stays accessible
  if (!imgElement || !imgElement.src) {
    throw new Error("No image returned from Puter.js.")
  }

  // If src is already a data URL or https URL, return it directly
  if (imgElement.src.startsWith("data:") || imgElement.src.startsWith("http")) {
    return imgElement.src
  }

  // For blob URLs, fetch and re-create a stable object URL
  const response = await fetch(imgElement.src)
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export const MODEL_OPTIONS: { label: string; value: ImageModel; badge?: string; description?: string }[] = [
  { label: "DALL·E 3", value: "dall-e-3", badge: "Best Quality", description: "Highest quality, detailed images" },
  { label: "Flux 1.1 Pro", value: "black-forest-labs/FLUX.1.1-pro", badge: "Most Realistic", description: "Photorealistic results" },
  { label: "Imagen 4 Ultra", value: "google/imagen-4.0-ultra", badge: "Ultra HD", description: "Google's premium model" },
  { label: "Gemini 2.5 Flash", value: "gemini-2.5-flash-image-preview", badge: "Fastest", description: "Quick generation" },
  { label: "Ideogram 3.0", value: "ideogram/ideogram-3.0", badge: "Text in Images", description: "Best for text rendering" },
]

/** Models that support quality selection and their allowed values */
export const QUALITY_SUPPORT: Record<string, ("low" | "medium" | "high" | "hd" | "standard")[]> = {
  "dall-e-3": ["standard", "hd"],
  "black-forest-labs/FLUX.1.1-pro": ["low", "medium", "high"],
  "google/imagen-4.0-ultra": ["low", "medium", "high"],
}

/** Size options with labels and aspect ratios */
export const SIZE_OPTIONS: { label: string; value: ImageSize; ratio: string; icon: string }[] = [
  { label: "Square", value: "1024x1024", ratio: "1:1", icon: "Square" },
  { label: "Landscape", value: "1792x1024", ratio: "16:9", icon: "RectangleHorizontal" },
  { label: "Portrait", value: "1024x1792", ratio: "9:16", icon: "RectangleVertical" },
  { label: "Large Square", value: "1536x1536", ratio: "1:1", icon: "Maximize2" },
  { label: "Widescreen", value: "1280x720", ratio: "16:9", icon: "Monitor" },
]

/** Models that support size selection */
export const SIZE_SUPPORT: Record<string, ImageSize[]> = {
  "dall-e-3": ["1024x1024", "1792x1024", "1024x1792"],
  "black-forest-labs/FLUX.1.1-pro": ["1024x1024", "1792x1024", "1024x1792", "1536x1536", "1280x720"],
  "google/imagen-4.0-ultra": ["1024x1024", "1792x1024", "1024x1792", "1536x1536", "1280x720"],
  "gemini-2.5-flash-image-preview": ["1024x1024", "1792x1024", "1024x1792", "1280x720"],
  "ideogram/ideogram-3.0": ["1024x1024", "1792x1024", "1024x1792", "1280x720"],
}
