import type { HistoryEntry } from '@/lib/calculation-history'

import {
  DEFAULT_PERSISTED_STATE,
  PERSISTED_VERSION,
  type PersistedStateV1,
} from './types'

export const STORAGE_KEY = 'calculator-ai-demo:v3'

let storageDegraded = false

export function isStorageDegraded(): boolean {
  return storageDegraded
}

export function resetStorageDegradedForTests(): void {
  storageDegraded = false
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const entry = value as Record<string, unknown>
  return (
    typeof entry.id === 'string' &&
    typeof entry.expression === 'string' &&
    typeof entry.result === 'string' &&
    (entry.completedAt === undefined || typeof entry.completedAt === 'number')
  )
}

function parsePersistedState(raw: unknown): PersistedStateV1 | null {
  if (typeof raw !== 'object' || raw === null) {
    return null
  }

  const data = raw as Record<string, unknown>
  if (data.version !== PERSISTED_VERSION) {
    return null
  }

  if (!Array.isArray(data.history) || typeof data.memory !== 'number') {
    return null
  }

  if (!data.history.every(isHistoryEntry)) {
    return null
  }

  if (!Number.isFinite(data.memory)) {
    return null
  }

  return {
    version: PERSISTED_VERSION,
    history: data.history,
    memory: data.memory,
  }
}

export function loadPersistedState(): PersistedStateV1 {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    storageDegraded = true
    return { ...DEFAULT_PERSISTED_STATE }
  }

  if (raw === null) {
    return { ...DEFAULT_PERSISTED_STATE }
  }

  try {
    const parsed = parsePersistedState(JSON.parse(raw))
    return parsed ?? { ...DEFAULT_PERSISTED_STATE }
  } catch {
    return { ...DEFAULT_PERSISTED_STATE }
  }
}

export function savePersistedState(state: PersistedStateV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    storageDegraded = true
  }
}
