import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_PERSISTED_STATE,
  loadPersistedState,
  savePersistedState,
  STORAGE_KEY,
} from '@/lib/calculator-persistence'

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.get(key) ?? null
    },
    key(index: number) {
      return [...store.keys()][index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
  }
}

describe('calculator persistence', () => {
  let storage: Storage

  beforeEach(() => {
    storage = createLocalStorageMock()
    vi.stubGlobal('localStorage', storage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns defaults when storage key is missing', () => {
    expect(loadPersistedState()).toEqual(DEFAULT_PERSISTED_STATE)
  })

  it.each([
    { name: 'invalid JSON', value: '{not json' },
    { name: 'wrong version', value: JSON.stringify({ version: 2, history: [], memory: 0 }) },
    { name: 'missing history', value: JSON.stringify({ version: 1, memory: 0 }) },
    { name: 'malformed history entry', value: JSON.stringify({ version: 1, history: [{ id: 'x' }], memory: 0 }) },
    { name: 'non-finite memory', value: JSON.stringify({ version: 1, history: [], memory: NaN }) },
  ])('returns defaults for corrupt data: $name', ({ value }) => {
    storage.setItem(STORAGE_KEY, value)
    expect(loadPersistedState()).toEqual(DEFAULT_PERSISTED_STATE)
  })

  it('round-trips history and memory', () => {
    const state = {
      version: 1 as const,
      history: [
        { id: 'a', expression: '2 + 3', result: '5' },
        { id: 'b', expression: '4 × 2', result: '8' },
      ],
      memory: 42,
    }

    savePersistedState(state)
    expect(loadPersistedState()).toEqual(state)
  })

  it('returns defaults when localStorage throws on read', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('storage blocked')
      },
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    })

    expect(loadPersistedState()).toEqual(DEFAULT_PERSISTED_STATE)
  })

  it('does not throw when localStorage throws on save', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('storage blocked')
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    })

    expect(() =>
      savePersistedState({
        version: 1,
        history: [],
        memory: 0,
      }),
    ).not.toThrow()
  })
})
