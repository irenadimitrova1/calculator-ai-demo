export const HISTORY_CAP = 25

export type HistoryEntry = {
  id: string
  expression: string
  result: string
}

export type AppendEntryInput = {
  expression: string
  result: string
  id?: string
}
