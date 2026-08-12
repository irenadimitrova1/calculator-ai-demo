import { describe, expect, it } from 'vitest'

import type { Operator } from '@/lib/calculation'
import {
  initialState,
  transition,
  type CalculationSessionAction,
} from '@/lib/calculation-session'

function digit(d: number): CalculationSessionAction {
  return { type: 'digit', digit: d }
}

function operator(op: Operator): CalculationSessionAction {
  return { type: 'operator', operator: op }
}

const equals: CalculationSessionAction = { type: 'equals' }

function runScenario(actions: CalculationSessionAction[]) {
  return actions.reduce(transition, initialState)
}

describe('calculation session', () => {
  it.each([
    {
      name: 'digit entry',
      actions: [digit(1), digit(2)],
      expected: { topLine: '12', bottomLine: '' },
    },
    {
      name: 'full calculation',
      actions: [digit(2), operator('add'), digit(3), equals],
      expected: { topLine: '', bottomLine: '5' },
    },
    {
      name: 'post-result chaining',
      actions: [
        digit(2),
        operator('add'),
        digit(3),
        equals,
        operator('add'),
        digit(4),
        equals,
      ],
      expected: { topLine: '', bottomLine: '9' },
    },
    {
      name: 'divide by zero',
      actions: [digit(5), operator('divide'), digit(0), equals],
      expected: { topLine: '', bottomLine: 'Infinity' },
    },
    {
      name: 'leading zero replacement',
      actions: [digit(0), digit(5)],
      expected: { topLine: '5', bottomLine: '' },
    },
    {
      name: 'operator change in second operand when top line empty',
      actions: [digit(2), operator('add'), operator('subtract')],
      expected: { topLine: '', bottomLine: '', phase: 'secondOperand' as const },
    },
    {
      name: 'no-op equals when preconditions not met',
      actions: [digit(2), equals],
      expected: { topLine: '2', bottomLine: '', phase: 'firstOperand' as const },
    },
    {
      name: 'post-result digit clears session',
      actions: [digit(2), operator('add'), digit(3), equals, digit(7)],
      expected: { topLine: '7', bottomLine: '', phase: 'firstOperand' as const },
    },
    {
      name: 'post-result operator chains from bottom line',
      actions: [digit(2), operator('add'), digit(3), equals, operator('add')],
      expected: {
        topLine: '',
        bottomLine: '',
        phase: 'secondOperand' as const,
        firstOperand: 5,
      },
    },
  ])('$name', ({ actions, expected }) => {
    const state = runScenario(actions)
    expect(state.topLine).toBe(expected.topLine)
    expect(state.bottomLine).toBe(expected.bottomLine)
    if ('phase' in expected) {
      expect(state.phase).toBe(expected.phase)
    }
    if ('firstOperand' in expected) {
      expect(state.firstOperand).toBe(expected.firstOperand)
    }
  })
})
