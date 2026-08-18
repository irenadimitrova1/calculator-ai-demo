import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  appendEntry,
  clearHistory,
  createEmptyHistory,
  formatCombinedLine,
  formatTime24h,
  getRecallResult,
  groupEntriesByDate,
  HISTORY_CAP,
} from '@/lib/calculation-history'

const FIXED_NOW = new Date('2026-08-18T14:34:00').getTime()

describe('calculation history', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('createEmptyHistory returns an empty list', () => {
    expect(createEmptyHistory()).toEqual([])
  })

  it.each([
    {
      name: 'append single entry',
      actions: [{ expression: '2 + 3', result: '5', id: 'a', completedAt: FIXED_NOW }],
      expected: [
        { id: 'a', expression: '2 + 3', result: '5', completedAt: FIXED_NOW },
      ],
    },
    {
      name: 'newest first after two appends',
      actions: [
        { expression: '2 + 3', result: '5', id: 'first', completedAt: FIXED_NOW - 1_000 },
        { expression: '4 × 2', result: '8', id: 'second', completedAt: FIXED_NOW },
      ],
      expected: [
        { id: 'second', expression: '4 × 2', result: '8', completedAt: FIXED_NOW },
        { id: 'first', expression: '2 + 3', result: '5', completedAt: FIXED_NOW - 1_000 },
      ],
    },
    {
      name: 'duplicate rows allowed',
      actions: [
        { expression: '1 + 1', result: '2', id: 'dup-1', completedAt: FIXED_NOW },
        { expression: '1 + 1', result: '2', id: 'dup-2', completedAt: FIXED_NOW },
      ],
      expected: [
        { id: 'dup-2', expression: '1 + 1', result: '2', completedAt: FIXED_NOW },
        { id: 'dup-1', expression: '1 + 1', result: '2', completedAt: FIXED_NOW },
      ],
    },
  ])('$name', ({ actions, expected }) => {
    let entries = createEmptyHistory()
    for (const action of actions) {
      entries = appendEntry(entries, action)
    }
    expect(entries).toEqual(expected)
  })

  it('sets completedAt automatically when omitted on append', () => {
    const entries = appendEntry(createEmptyHistory(), {
      expression: '1 + 1',
      result: '2',
      id: 'auto-time',
    })

    expect(entries[0]?.completedAt).toBe(FIXED_NOW)
  })

  it('drops oldest entry when exceeding HISTORY_CAP', () => {
    let entries = createEmptyHistory()

    for (let i = 1; i <= HISTORY_CAP + 1; i += 1) {
      entries = appendEntry(entries, {
        expression: `${i}`,
        result: `${i}`,
        id: String(i),
        completedAt: FIXED_NOW + i,
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
      completedAt: FIXED_NOW,
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

  it('formats time as 24-hour HH:mm', () => {
    expect(formatTime24h(new Date('2026-08-18T14:34:00').getTime())).toBe('14:34')
    expect(formatTime24h(new Date('2026-08-18T09:05:00').getTime())).toBe('09:05')
  })

  it('groups entries by Today, Yesterday, and locale date', () => {
    const today = new Date('2026-08-18T10:00:00').getTime()
    const yesterday = new Date('2026-08-17T10:00:00').getTime()
    const older = new Date('2026-08-10T10:00:00').getTime()
    const now = new Date('2026-08-18T15:00:00').getTime()

    const groups = groupEntriesByDate(
      [
        { id: '1', expression: '1', result: '1', completedAt: today },
        { id: '2', expression: '2', result: '2', completedAt: yesterday },
        { id: '3', expression: '3', result: '3', completedAt: older },
      ],
      now,
    )

    expect(groups).toHaveLength(3)
    expect(groups[0]?.label).toBe('Today')
    expect(groups[0]?.entries).toHaveLength(1)
    expect(groups[1]?.label).toBe('Yesterday')
    expect(groups[2]?.label).toMatch(/Aug/)
  })

  it('returns empty groups for empty history', () => {
    expect(groupEntriesByDate([], FIXED_NOW)).toEqual([])
  })

  it('groups legacy entries without completedAt using now', () => {
    const groups = groupEntriesByDate(
      [{ id: 'legacy', expression: '1', result: '1' }],
      FIXED_NOW,
    )

    expect(groups).toEqual([
      {
        label: 'Today',
        entries: [{ id: 'legacy', expression: '1', result: '1' }],
      },
    ])
  })
})
