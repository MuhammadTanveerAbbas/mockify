"use client"

import { useState, useMemo } from "react"
import { Clock, Copy, Check, ChevronRight, Trash2, Search, X } from "lucide-react"

export interface HistoryItem {
  id: string
  prompt: string
  model: string
  imageUrl: string
  timestamp: Date
}

interface PromptHistoryProps {
  items: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

function HistoryCard({
  item,
  onSelect,
  onDelete,
}: {
  item: HistoryItem
  onSelect: () => void
  onDelete: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(item.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const timeLabel = item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className="group flex w-full cursor-pointer items-start gap-3 rounded-xl border border-border/80 bg-card p-4 text-left transition-all hover:border-ring/40 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/30"
    >
      <img
        src={item.imageUrl}
        alt={item.prompt}
        className="h-14 w-14 shrink-0 rounded-lg object-cover opacity-80 group-hover:opacity-100 transition-opacity"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-xs font-semibold text-foreground">{item.prompt}</span>
          <span className="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {item.model}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {timeLabel}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 pt-0.5">
        <button
          onClick={handleCopy}
          title="Copy prompt"
          className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-secondary hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3 text-muted-foreground" /> : <Copy className="h-3 w-3" />}
        </button>
        <button
          onClick={handleDelete}
          title="Delete"
          className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 opacity-0 transition-all group-hover:opacity-100" />
      </div>
    </div>
  )
}

export function PromptHistory({ items, onSelect, onDelete, onClearAll }: PromptHistoryProps) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(
      (i) => i.prompt.toLowerCase().includes(q) || i.model.toLowerCase().includes(q)
    )
  }, [items, search])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/60 bg-card py-20 text-center">
        <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
          <Clock className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">No history yet</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Generated images will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history…"
            className="w-full rounded-lg border border-border bg-background/60 py-2 pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground/35 focus:border-foreground/25 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <button
          onClick={onClearAll}
          className="shrink-0 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        >
          Clear all
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-xs text-muted-foreground/50">No results for "{search}"</p>
      ) : (
        <div className="flex flex-col gap-2.5" role="list">
          {filtered.map((item) => (
            <div key={item.id} role="listitem">
              <HistoryCard
                item={item}
                onSelect={() => onSelect(item)}
                onDelete={() => onDelete(item.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
