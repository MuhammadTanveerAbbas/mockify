declare global {
  interface Window {
    puter: {
      ai: {
        txt2img: (
          prompt: string,
          options?: {
            model?: string
            quality?: "low" | "medium" | "high" | "hd" | "standard"
          }
        ) => Promise<HTMLImageElement>
      }
    }
  }
}
export {}
