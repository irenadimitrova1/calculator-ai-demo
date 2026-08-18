import type { HistoryEntry } from '@/lib/calculation-history'

export const PERSISTED_VERSION = 1

export type PersistedStateV1 = {
  version: typeof PERSISTED_VERSION
  history: HistoryEntry[]
  memory: number
}

export const DEFAULT_PERSISTED_STATE: PersistedStateV1 = {
  version: PERSISTED_VERSION,
  history: [],
  memory: 0,
}
