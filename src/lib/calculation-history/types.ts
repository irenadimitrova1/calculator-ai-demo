export const HISTORY_CAP = 25

export type HistoryEntry = {
  id: string
  expression: string
  result: string
  completedAt?: number
}

export type AppendEntryInput = {
  expression: string
  result: string
  id?: string
  completedAt?: number
}

export type HistoryDateGroup = {
  label: string
  entries: HistoryEntry[]
}
