import { describe, expect, it } from 'vitest'

import { formatDisplay } from '@/lib/format-display'

describe('formatDisplay', () => {
  it.each([
    { value: 0.1 + 0.2, expected: '0.3' },
    { value: 5, expected: '5' },
    { value: 16, expected: '16' },
    { value: 1 / 3, expected: '0.3333333333' },
    { value: Number.POSITIVE_INFINITY, expected: 'Infinity' },
    { value: Number.NEGATIVE_INFINITY, expected: '-Infinity' },
  ])('formats $value as $expected', ({ value, expected }) => {
    expect(formatDisplay(value)).toBe(expected)
  })

  it('caps long integers at 12 visible characters', () => {
    expect(formatDisplay(1234567890123)).toBe('123456789012')
  })
})
