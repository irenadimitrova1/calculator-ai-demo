import type { AppendEntryInput, HistoryEntry } from './types'
import { HISTORY_CAP } from './types'

export function createEmptyHistory(): HistoryEntry[] {
  return []
}

export function appendEntry(
  entries: HistoryEntry[],
  input: AppendEntryInput,
): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: input.id ?? crypto.randomUUID(),
    expression: input.expression,
    result: input.result,
  }

  const next = [entry, ...entries]
  if (next.length > HISTORY_CAP) {
    return next.slice(0, HISTORY_CAP)
  }

  return next
}

export function clearHistory(): HistoryEntry[] {
  return []
}

export function formatCombinedLine(entry: HistoryEntry): string {
  return `${entry.expression} = ${entry.result}`
}

export function getRecallResult(entry: HistoryEntry): string {
  return entry.result
}
