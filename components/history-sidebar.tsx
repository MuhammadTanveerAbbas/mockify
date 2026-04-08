"use client"

import { cn } from "@/lib/utils"

export interface HistoryItem {
  id: string
  imageUrl: string
  prompt: string
  createdAt: Date
  model?: string
}

interface HistorySidebarProps {
  items: HistoryItem[]
  activeId: string | null
  onSelect: (item: HistoryItem) => void
  /** When true, renders the vertical desktop sidebar (hidden below lg). When false/omitted, renders the mobile horizontal strip (hidden at lg+). */
  desktopOnly?: boolean
}

export function HistorySidebar({ items, activeId, onSelect, desktopOnly }: HistorySidebarProps) {
  if (items.length === 0) return null

  // Desktop: vertical sidebar
  if (desktopOnly) {
    return (
      <aside className="hidden lg:flex flex-col gap-2 w-52 shrink-0">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1 px-1">
          History
        </p>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={cn(
                "group relative overflow-hidden rounded-lg border text-left transition-colors",
                activeId === item.id
                  ? "border-ring bg-secondary"
                  : "border-border bg-card hover:border-ring/50"
              )}
            >
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="h-24 w-full object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground font-mono truncate leading-relaxed">
                  {item.prompt.length > 40 ? item.prompt.slice(0, 40) + "…" : item.prompt}
                </p>
                <p className="text-[10px] text-muted-foreground/50 font-mono mt-0.5">
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>
    )
  }

  // Mobile/tablet: horizontal scrollable strip
  return (
    <div className="lg:hidden mb-4">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 px-1">
        History
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={cn(
              "group relative shrink-0 overflow-hidden rounded-lg border text-left transition-colors w-28",
              activeId === item.id
                ? "border-ring bg-secondary"
                : "border-border bg-card hover:border-ring/50"
            )}
          >
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="h-16 w-full object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="px-1.5 py-1">
              <p className="text-[10px] text-muted-foreground font-mono truncate leading-relaxed">
                {item.prompt.length > 20 ? item.prompt.slice(0, 20) + "…" : item.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
