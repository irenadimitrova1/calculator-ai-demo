import { describe, expect, it } from 'vitest'

import {
  appendEntry,
  clearHistory,
  createEmptyHistory,
  formatCombinedLine,
  getRecallResult,
  HISTORY_CAP,
} from '@/lib/calculation-history'

describe('calculation history', () => {
  it('createEmptyHistory returns an empty list', () => {
    expect(createEmptyHistory()).toEqual([])
  })

  it.each([
    {
      name: 'append single entry',
      actions: [{ expression: '2 + 3', result: '5', id: 'a' }],
      expected: [{ id: 'a', expression: '2 + 3', result: '5' }],
    },
    {
      name: 'newest first after two appends',
      actions: [
        { expression: '2 + 3', result: '5', id: 'first' },
        { expression: '4 × 2', result: '8', id: 'second' },
      ],
      expected: [
        { id: 'second', expression: '4 × 2', result: '8' },
        { id: 'first', expression: '2 + 3', result: '5' },
      ],
    },
    {
      name: 'duplicate rows allowed',
      actions: [
        { expression: '1 + 1', result: '2', id: 'dup-1' },
        { expression: '1 + 1', result: '2', id: 'dup-2' },
      ],
      expected: [
        { id: 'dup-2', expression: '1 + 1', result: '2' },
        { id: 'dup-1', expression: '1 + 1', result: '2' },
      ],
    },
  ])('$name', ({ actions, expected }) => {
    let entries = createEmptyHistory()
    for (const action of actions) {
      entries = appendEntry(entries, action)
    }
    expect(entries).toEqual(expected)
  })

  it('drops oldest entry when exceeding HISTORY_CAP', () => {
    let entries = createEmptyHistory()

    for (let i = 1; i <= HISTORY_CAP + 1; i += 1) {
      entries = appendEntry(entries, {
        expression: `${i}`,
        result: `${i}`,
        id: String(i),
      })
    }

    expect(entries).toHaveLength(HISTORY_CAP)
    expect(entries[0]?.id).toBe(String(HISTORY_CAP + 1))
    expect(entries.some((entry) => entry.id === '1')).toBe(false)
    expect(entries[entries.length - 1]?.id).toBe('2')
  })

  it('clearHistory removes all entries after append', () => {
    const entries = appendEntry(createEmptyHistory(), {
      expression: '2 + 2',
      result: '4',
      id: 'clear-me',
    })

    expect(clearHistory()).toEqual([])
    expect(entries).toHaveLength(1)
  })

  it.each([
    {
      name: 'recall payload returns result only',
      entry: { id: 'x', expression: '5 + 3 × 2', result: '16' },
      expected: '16',
    },
    {
      name: 'combined line formatting',
      entry: { id: 'x', expression: '5 + 3 × 2', result: '16' },
      expectedLine: '5 + 3 × 2 = 16',
    },
  ])('$name', ({ entry, expected, expectedLine }) => {
    if (expected !== undefined) {
      expect(getRecallResult(entry)).toBe(expected)
      expect(getRecallResult(entry)).not.toBe(entry.expression)
    }
    if (expectedLine !== undefined) {
      expect(formatCombinedLine(entry)).toBe(expectedLine)
    }
  })

  it('assigns a non-empty id when omitted on append', () => {
    const entries = appendEntry(createEmptyHistory(), {
      expression: '1 + 1',
      result: '2',
    })

    expect(entries[0]?.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  })
})
