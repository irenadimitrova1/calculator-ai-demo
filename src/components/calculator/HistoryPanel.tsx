import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatCombinedLine,
  formatTime24h,
  groupEntriesByDate,
  type HistoryEntry,
} from '@/lib/calculation-history'

type HistoryPanelProps = {
  entries: HistoryEntry[]
  onRecall: (entry: HistoryEntry) => void
  onClear: () => void
}

export function HistoryPanel({ entries, onRecall, onClear }: HistoryPanelProps) {
  const groups = useMemo(() => groupEntriesByDate(entries), [entries])
  const flatEntries = useMemo(
    () => groups.flatMap((group) => group.entries),
    [groups],
  )
  const entryIndexById = useMemo(
    () => new Map(flatEntries.map((entry, index) => [entry.id, index])),
    [flatEntries],
  )
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const recallAt = useCallback(
    (index: number) => {
      const entry = flatEntries[index]
      if (entry !== undefined) {
        onRecall(entry)
      }
    },
    [flatEntries, onRecall],
  )

  const handleListKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (flatEntries.length === 0) {
        return
      }

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault()
          setFocusedIndex((current) => {
            if (current < 0) {
              return 0
            }
            return Math.min(current + 1, flatEntries.length - 1)
          })
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          setFocusedIndex((current) => {
            if (current < 0) {
              return flatEntries.length - 1
            }
            return Math.max(current - 1, 0)
          })
          break
        }
        case 'Home': {
          event.preventDefault()
          setFocusedIndex(0)
          break
        }
        case 'End': {
          event.preventDefault()
          setFocusedIndex(flatEntries.length - 1)
          break
        }
        case 'Enter':
        case ' ': {
          event.preventDefault()
          if (focusedIndex >= 0) {
            recallAt(focusedIndex)
          }
          break
        }
        default:
          break
      }
    },
    [flatEntries.length, focusedIndex, recallAt],
  )

  return (
    <Card className="flex w-full max-w-xs flex-col md:max-h-[calc(100vh-2rem)] md:shrink-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-base">History</CardTitle>
        <Button
          aria-label="Clear history"
          disabled={entries.length === 0}
          onClick={onClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear history
        </Button>
      </CardHeader>

      <CardContent className="flex min-h-32 flex-1 flex-col pt-0">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No calculations yet</p>
        ) : (
          <div
            aria-label="Calculation history"
            className="max-h-96 overflow-y-auto md:max-h-none md:flex-1"
            onKeyDown={handleListKeyDown}
            role="listbox"
            tabIndex={0}
          >
            {groups.map((group) => (
              <section key={group.label}>
                <h3 className="sticky top-0 z-10 bg-card py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </h3>
                <ul className="space-y-1">
                  {group.entries.map((entry) => {
                    const entryIndex = entryIndexById.get(entry.id) ?? 0
                    const isFocused = focusedIndex === entryIndex

                    return (
                      <li key={entry.id}>
                        <button
                          aria-selected={isFocused}
                          className="flex w-full items-start justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                          onClick={() => onRecall(entry)}
                          onFocus={() => setFocusedIndex(entryIndex)}
                          role="option"
                          tabIndex={isFocused ? 0 : -1}
                          title={formatCombinedLine(entry)}
                          type="button"
                        >
                          <span className="truncate font-mono tabular-nums">
                            {formatCombinedLine(entry)}
                          </span>
                          {entry.completedAt !== undefined ? (
                            <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                              {formatTime24h(entry.completedAt)}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
