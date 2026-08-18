import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HISTORY_CAP } from '@/lib/calculation-history'
import { loadPersistedState, STORAGE_KEY } from '@/lib/calculator-persistence'
import { useCalculator } from '@/hooks/useCalculator'

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

function basicEquals(result: ReturnType<typeof useCalculator>, a: number, op: 'add' | 'subtract' | 'multiply' | 'divide', b: number) {
  act(() => {
    result.pressDigit(a)
    result.pressOperator(op)
    result.pressDigit(b)
    result.pressEquals()
  })
}

describe('useCalculator history and persistence', () => {
  let storage: Storage

  beforeEach(() => {
    storage = createLocalStorageMock()
    vi.stubGlobal('localStorage', storage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('appends one history row on successful Basic equals', () => {
    const { result } = renderHook(() => useCalculator())

    basicEquals(result.current, 2, 'add', 3)

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]?.expression).toBe('2 + 3')
    expect(result.current.history[0]?.result).toBe('5')
  })

  it('does not append on Basic repeat-equals', () => {
    const { result } = renderHook(() => useCalculator())

    basicEquals(result.current, 2, 'add', 3)
    act(() => {
      result.current.pressEquals()
    })

    expect(result.current.history).toHaveLength(1)
  })

  it('appends one history row on successful Scientific equals', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.setMode('scientific')
      result.current.pressOpenParen()
      result.current.pressDigit(2)
      result.current.pressOperator('add')
      result.current.pressDigit(3)
      result.current.pressCloseParen()
      result.current.pressOperator('multiply')
      result.current.pressDigit(4)
      result.current.pressEquals()
    })

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]?.result).toBe('20')
  })

  it('does not append history on error-state equals', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.pressDigit(5)
      result.current.pressOperator('divide')
      result.current.pressDigit(0)
      result.current.pressEquals()
    })

    expect(result.current.activeNumber).toBe('Error')
    expect(result.current.history).toHaveLength(0)
  })

  it('recall clears expression and sets entry result as active number', () => {
    const { result } = renderHook(() => useCalculator())

    basicEquals(result.current, 2, 'add', 3)
    const entry = result.current.history[0]!

    act(() => {
      result.current.recallHistory(entry)
    })

    expect(result.current.expressionLine).toBe('')
    expect(result.current.activeNumber).toBe('5')

    act(() => {
      result.current.pressOperator('add')
      result.current.pressDigit(2)
      result.current.pressEquals()
    })

    expect(result.current.activeNumber).toBe('7')
  })

  it('clearHistory empties list without clearing memory or in-progress session', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.pressDigit(5)
      result.current.pressMemoryAdd()
    })

    act(() => {
      result.current.pressDigit(2)
      result.current.pressOperator('add')
      result.current.pressDigit(3)
      result.current.pressEquals()
    })

    act(() => {
      result.current.pressDigit(4)
      result.current.pressOperator('add')
      result.current.pressDigit(1)
    })

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.history).toHaveLength(0)
    expect(result.current.hasMemory).toBe(true)
    expect(result.current.expressionLine).toBe('4 +')
    expect(result.current.activeNumber).toBe('1')
  })

  it.each([
    {
      name: 'AC',
      action: (current: ReturnType<typeof useCalculator>) => current.pressAllClear(),
    },
    {
      name: 'Clear after result',
      action: (current: ReturnType<typeof useCalculator>) => {
        current.pressClear()
      },
    },
    {
      name: 'mode switch',
      action: (current: ReturnType<typeof useCalculator>) => {
        current.setMode('scientific')
      },
    },
  ])('preserves history after $name', ({ action }) => {
    const { result } = renderHook(() => useCalculator())

    basicEquals(result.current, 2, 'add', 3)

    act(() => {
      action(result.current)
    })

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]?.expression).toBe('2 + 3')
  })

  it('restores history and memory on simulated refresh', () => {
    const { result, unmount } = renderHook(() => useCalculator())

    act(() => {
      result.current.pressDigit(2)
      result.current.pressOperator('add')
      result.current.pressDigit(3)
      result.current.pressEquals()
    })

    act(() => {
      result.current.pressDigit(7)
      result.current.pressMemoryAdd()
    })

    expect(storage.getItem(STORAGE_KEY)).not.toBeNull()

    unmount()

    const { result: refreshed } = renderHook(() => useCalculator())

    expect(refreshed.current.history).toHaveLength(1)
    expect(refreshed.current.history[0]?.expression).toBe('2 + 3')
    expect(refreshed.current.history[0]?.result).toBe('5')
    expect(refreshed.current.hasMemory).toBe(true)
    expect(refreshed.current.mode).toBe('basic')
    expect(refreshed.current.expressionLine).toBe('')
    expect(refreshed.current.activeNumber).toBe('')
  })

  it('restores capped history order from localStorage on refresh', () => {
    const entries = Array.from({ length: HISTORY_CAP + 2 }, (_, index) => ({
      id: String(index + 1),
      expression: `${index + 1}`,
      result: `${index + 1}`,
    }))

    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        history: entries.slice().reverse().slice(0, HISTORY_CAP),
        memory: 0,
      }),
    )

    const { result } = renderHook(() => useCalculator())

    expect(result.current.history).toHaveLength(HISTORY_CAP)
    expect(result.current.history[0]?.id).toBe(String(HISTORY_CAP + 2))
    expect(loadPersistedState().history).toHaveLength(HISTORY_CAP)
  })
})
