import type { AppendEntryInput, HistoryDateGroup, HistoryEntry } from './types'
import { HISTORY_CAP } from './types'

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function formatDateLabel(timestamp: number, now: number): string {
  const dayStart = startOfDay(timestamp)
  const todayStart = startOfDay(now)
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000

  if (dayStart === todayStart) {
    return 'Today'
  }
  if (dayStart === yesterdayStart) {
    return 'Yesterday'
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}

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
    completedAt: input.completedAt ?? Date.now(),
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

export function formatTime24h(completedAt: number): string {
  const date = new Date(completedAt)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function groupEntriesByDate(
  entries: HistoryEntry[],
  now: number = Date.now(),
): HistoryDateGroup[] {
  const groups: HistoryDateGroup[] = []
  const groupMap = new Map<string, HistoryEntry[]>()
  const order: string[] = []

  for (const entry of entries) {
    const timestamp = entry.completedAt ?? now
    const label = formatDateLabel(timestamp, now)
    if (!groupMap.has(label)) {
      groupMap.set(label, [])
      order.push(label)
    }
    groupMap.get(label)!.push(entry)
  }

  for (const label of order) {
    groups.push({ label, entries: groupMap.get(label)! })
  }

  return groups
}
