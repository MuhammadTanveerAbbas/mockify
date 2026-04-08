import { Layers } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary">
        <Layers className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">No mockup yet</p>
        <p className="text-xs font-mono text-muted-foreground max-w-xs leading-relaxed">
          Describe your image in detail. Choose size and quality settings for best results.
        </p>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2 max-w-sm">
        {["High Quality", "Full Frame", "No Cropping", "Professional"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
