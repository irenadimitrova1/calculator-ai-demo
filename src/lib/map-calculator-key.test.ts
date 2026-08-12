import { describe, expect, it } from 'vitest'

import { mapCalculatorKey, type CalculatorKeyAction } from '@/lib/map-calculator-key'

type KeyEvent = Pick<KeyboardEvent, 'key' | 'code' | 'shiftKey'>

function keyEvent(
  key: string,
  code = '',
  shiftKey = false,
): KeyEvent {
  return { key, code, shiftKey }
}

describe('mapCalculatorKey — basic mode', () => {
  const basicCases: Array<{ event: KeyEvent; expected: CalculatorKeyAction }> = [
    { event: keyEvent('0'), expected: { type: 'digit', digit: 0 } },
    { event: keyEvent('5'), expected: { type: 'digit', digit: 5 } },
    { event: keyEvent('9'), expected: { type: 'digit', digit: 9 } },
    { event: keyEvent('.'), expected: { type: 'decimal' } },
    { event: keyEvent('+'), expected: { type: 'operator', operator: 'add' } },
    { event: keyEvent('-'), expected: { type: 'operator', operator: 'subtract' } },
    { event: keyEvent('*'), expected: { type: 'operator', operator: 'multiply' } },
    { event: keyEvent('/'), expected: { type: 'operator', operator: 'divide' } },
    { event: keyEvent('Enter'), expected: { type: 'equals' } },
    { event: keyEvent('='), expected: { type: 'equals' } },
    { event: keyEvent('Backspace'), expected: { type: 'backspace' } },
    { event: keyEvent('Escape'), expected: { type: 'allClear' } },
    { event: keyEvent('2', 'Numpad2'), expected: { type: 'digit', digit: 2 } },
    { event: keyEvent('+', 'NumpadAdd'), expected: { type: 'operator', operator: 'add' } },
    { event: keyEvent('Enter', 'NumpadEnter'), expected: { type: 'equals' } },
  ]

  it.each(basicCases)(
    'maps $event.key ($event.code) to $expected.type',
    ({ event, expected }) => {
      expect(mapCalculatorKey(event, 'basic')).toEqual(expected)
      expect(mapCalculatorKey(event, 'scientific')).toEqual(expected)
    },
  )

  const ignoredInBasic: KeyEvent[] = [
    keyEvent('('),
    keyEvent(')'),
    keyEvent('^'),
    keyEvent('s'),
    keyEvent('c'),
    keyEvent('t'),
    keyEvent('l'),
    keyEvent('g'),
    keyEvent('p'),
    keyEvent('e'),
    keyEvent('r'),
    keyEvent('q'),
    keyEvent('S', '', true),
  ]

  it.each(ignoredInBasic)('ignores scientific key %s in basic mode', (event) => {
    expect(mapCalculatorKey(event, 'basic')).toBeNull()
  })
})

describe('mapCalculatorKey — scientific mode', () => {
  const scientificCases: Array<{ event: KeyEvent; expected: CalculatorKeyAction }> = [
    { event: keyEvent('('), expected: { type: 'openParen' } },
    { event: keyEvent(')'), expected: { type: 'closeParen' } },
    { event: keyEvent('^'), expected: { type: 'power' } },
    { event: keyEvent('s'), expected: { type: 'unaryFunction', name: 'sin' } },
    { event: keyEvent('c'), expected: { type: 'unaryFunction', name: 'cos' } },
    { event: keyEvent('t'), expected: { type: 'unaryFunction', name: 'tan' } },
    { event: keyEvent('l'), expected: { type: 'unaryFunction', name: 'ln' } },
    { event: keyEvent('g'), expected: { type: 'unaryFunction', name: 'log' } },
    { event: keyEvent('p'), expected: { type: 'constant', name: 'pi' } },
    { event: keyEvent('e'), expected: { type: 'constant', name: 'e' } },
    { event: keyEvent('r'), expected: { type: 'unaryFunction', name: 'sqrt' } },
    { event: keyEvent('q'), expected: { type: 'unaryFunction', name: 'square' } },
    { event: keyEvent('S', '', true), expected: { type: 'unaryFunction', name: 'asin' } },
    { event: keyEvent('C', '', true), expected: { type: 'unaryFunction', name: 'acos' } },
    { event: keyEvent('T', '', true), expected: { type: 'unaryFunction', name: 'atan' } },
  ]

  it.each(scientificCases)(
    'maps $event.key to $expected.type',
    ({ event, expected }) => {
      expect(mapCalculatorKey(event, 'scientific')).toEqual(expected)
    },
  )
})
