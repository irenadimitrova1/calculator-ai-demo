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
      name: 'digit entry on active number',
      actions: [digit(1), digit(2)],
      expected: { expressionLine: '', activeNumber: '12' },
    },
    {
      name: 'full calculation',
      actions: [digit(2), operator('add'), digit(3), equals],
      expected: { expressionLine: '2 + 3 =', activeNumber: '5' },
    },
    {
      name: 'immediate chaining 5 + 3 × 2 =',
      actions: [
        digit(5),
        operator('add'),
        digit(3),
        operator('multiply'),
        digit(2),
        equals,
      ],
      expected: { expressionLine: '5 + 3 × 2 =', activeNumber: '16' },
    },
    {
      name: 'trail after plus before typing second operand',
      actions: [digit(5), operator('add'), digit(3)],
      expected: { expressionLine: '5 +', activeNumber: '3' },
    },
    {
      name: 'trail after multiply commits partial result',
      actions: [digit(5), operator('add'), digit(3), operator('multiply')],
      expected: { expressionLine: '5 + 3 ×', activeNumber: '8' },
    },
    {
      name: 'repeat equals',
      actions: [
        digit(8),
        operator('add'),
        digit(2),
        equals,
        equals,
      ],
      expected: { expressionLine: '8 + 2 + 2', activeNumber: '12' },
    },
    {
      name: 'chained repeat equals',
      actions: [
        digit(8),
        operator('add'),
        digit(2),
        equals,
        equals,
        equals,
      ],
      expected: { expressionLine: '8 + 2 + 2 + 2', activeNumber: '14' },
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
      expected: { expressionLine: '5 + 4 =', activeNumber: '9' },
    },
    {
      name: 'divide by zero',
      actions: [digit(5), operator('divide'), digit(0), equals],
      expected: { expressionLine: '5 ÷ 0 =', activeNumber: 'Infinity' },
    },
    {
      name: 'leading zero replacement',
      actions: [digit(0), digit(5)],
      expected: { expressionLine: '', activeNumber: '5' },
    },
    {
      name: 'operator swap without second operand',
      actions: [digit(5), operator('add'), operator('multiply')],
      expected: { expressionLine: '5 ×', activeNumber: '' },
    },
    {
      name: 'operator swap subtract',
      actions: [digit(2), operator('add'), operator('subtract')],
      expected: { expressionLine: '2 −', activeNumber: '' },
    },
    {
      name: 'no-op equals when preconditions not met',
      actions: [digit(2), equals],
      expected: { expressionLine: '', activeNumber: '2', phase: 'entry' as const },
    },
    {
      name: 'post-result digit clears trail',
      actions: [digit(2), operator('add'), digit(3), equals, digit(7)],
      expected: { expressionLine: '', activeNumber: '7', phase: 'entry' as const },
    },
    {
      name: 'post-result operator chains from active number',
      actions: [digit(2), operator('add'), digit(3), equals, operator('add')],
      expected: {
        expressionLine: '5 +',
        activeNumber: '',
        runningTotal: 5,
      },
    },
  ])('$name', ({ actions, expected }) => {
    const state = runScenario(actions)
    expect(state.expressionLine).toBe(expected.expressionLine)
    expect(state.activeNumber).toBe(expected.activeNumber)
    if ('phase' in expected) {
      expect(state.phase).toBe(expected.phase)
    }
    if ('runningTotal' in expected) {
      expect(state.runningTotal).toBe(expected.runningTotal)
    }
  })
})
