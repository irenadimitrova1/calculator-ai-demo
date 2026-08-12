import { describe, expect, it } from 'vitest'

import type { Operator } from '@/lib/calculation'
import {
  hasStoredMemory,
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
const allClear: CalculationSessionAction = { type: 'allClear' }
const clear: CalculationSessionAction = { type: 'clear' }
const decimal: CalculationSessionAction = { type: 'decimal' }
const signToggle: CalculationSessionAction = { type: 'signToggle' }
const percent: CalculationSessionAction = { type: 'percent' }
const memoryClear: CalculationSessionAction = { type: 'memoryClear' }
const memoryRecall: CalculationSessionAction = { type: 'memoryRecall' }
const memoryAdd: CalculationSessionAction = { type: 'memoryAdd' }
const memorySubtract: CalculationSessionAction = { type: 'memorySubtract' }
const backspace: CalculationSessionAction = { type: 'backspace' }

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
      expected: {
        expressionLine: '5 ÷ 0 =',
        activeNumber: 'Error',
        phase: 'error' as const,
      },
    },
    {
      name: 'divide by zero on operator commit',
      actions: [digit(5), operator('divide'), digit(0), operator('multiply')],
      expected: {
        expressionLine: '5 ÷ 0 ×',
        activeNumber: 'Error',
        phase: 'error' as const,
      },
    },
    {
      name: 'error digit recovery clears trail',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        digit(1),
      ],
      expected: {
        expressionLine: '',
        activeNumber: '1',
        phase: 'entry' as const,
      },
    },
    {
      name: 'error digit recovery preserves memory',
      actions: [
        digit(3),
        memoryAdd,
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        digit(1),
      ],
      expected: {
        expressionLine: '',
        activeNumber: '1',
        phase: 'entry' as const,
        memory: 3,
      },
    },
    {
      name: 'error decimal recovery',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        decimal,
      ],
      expected: {
        expressionLine: '',
        activeNumber: '0.',
        phase: 'entry' as const,
      },
    },
    {
      name: 'error operator recovery',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        operator('add'),
      ],
      expected: {
        expressionLine: '',
        activeNumber: '',
        phase: 'entry' as const,
        runningTotal: null,
      },
    },
    {
      name: 'error sign toggle recovery',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        signToggle,
      ],
      expected: {
        expressionLine: '',
        activeNumber: '-',
        phase: 'entry' as const,
      },
    },
    {
      name: 'error operator commit then digit recovery',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        operator('multiply'),
        digit(2),
      ],
      expected: {
        expressionLine: '',
        activeNumber: '2',
        phase: 'entry' as const,
      },
    },
    {
      name: 'error blocks equals',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        equals,
      ],
      expected: {
        expressionLine: '5 ÷ 0 =',
        activeNumber: 'Error',
        phase: 'error' as const,
      },
    },
    {
      name: 'AC from error',
      actions: [digit(5), operator('divide'), digit(0), equals, allClear],
      expected: initialState,
    },
    {
      name: 'C from error',
      actions: [digit(5), operator('divide'), digit(0), equals, clear],
      expected: initialState,
    },
    {
      name: 'AC from mid-calculation',
      actions: [digit(5), operator('add'), digit(3), allClear],
      expected: initialState,
    },
    {
      name: 'C mid-calculation clears active number',
      actions: [digit(5), operator('add'), digit(3), clear],
      expected: { expressionLine: '5 +', activeNumber: '' },
    },
    {
      name: 'C empty active mid-calculation is no-op',
      actions: [digit(5), operator('add'), clear],
      expected: { expressionLine: '5 +', activeNumber: '' },
    },
    {
      name: 'C after result resets session',
      actions: [digit(2), operator('add'), digit(3), equals, clear],
      expected: initialState,
    },
    {
      name: 'C on partial result clears active number',
      actions: [
        digit(5),
        operator('add'),
        digit(3),
        operator('multiply'),
        clear,
      ],
      expected: { expressionLine: '5 + 3 ×', activeNumber: '' },
    },
    {
      name: 'decimal entry',
      actions: [digit(3), decimal, digit(1)],
      expected: { expressionLine: '', activeNumber: '3.1' },
    },
    {
      name: 'leading decimal',
      actions: [decimal],
      expected: { expressionLine: '', activeNumber: '0.' },
    },
    {
      name: 'negative entry then digit',
      actions: [signToggle, digit(5)],
      expected: { expressionLine: '', activeNumber: '-5' },
    },
    {
      name: 'negative entry then decimal',
      actions: [signToggle, decimal],
      expected: { expressionLine: '', activeNumber: '-0.' },
    },
    {
      name: 'duplicate decimal is no-op',
      actions: [digit(3), decimal, decimal],
      expected: { expressionLine: '', activeNumber: '3.' },
    },
    {
      name: 'decimal after partial result',
      actions: [
        digit(5),
        operator('add'),
        digit(3),
        operator('multiply'),
        decimal,
      ],
      expected: { expressionLine: '5 + 3 ×', activeNumber: '0.' },
    },
    {
      name: 'sign toggle on finished result',
      actions: [digit(2), operator('add'), digit(3), equals, signToggle],
      expected: {
        expressionLine: '2 + 3 =',
        activeNumber: '-5',
        phase: 'result' as const,
      },
    },
    {
      name: 'sign toggle in-place',
      actions: [digit(5), signToggle, signToggle],
      expected: { expressionLine: '', activeNumber: '5' },
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
    if (expected === initialState) {
      expect(state).toEqual(initialState)
      return
    }
    expect(state.expressionLine).toBe(expected.expressionLine)
    expect(state.activeNumber).toBe(expected.activeNumber)
    if ('phase' in expected) {
      expect(state.phase).toBe(expected.phase)
    }
    if ('runningTotal' in expected) {
      expect(state.runningTotal).toBe(expected.runningTotal)
    }
    if ('memory' in expected) {
      expect(state.memory).toBe(expected.memory)
    }
  })

  it.each([
    {
      name: 'M+ stores active number',
      actions: [digit(5), memoryAdd],
      expected: { expressionLine: '', activeNumber: '5', memory: 5 },
    },
    {
      name: 'M− subtracts active number from memory',
      actions: [digit(5), memoryAdd, clear, digit(2), memorySubtract],
      expected: { expressionLine: '', activeNumber: '2', memory: 3 },
    },
    {
      name: 'M+ empty active with runningTotal',
      actions: [digit(5), operator('add'), digit(3), operator('multiply'), memoryAdd],
      expected: { expressionLine: '5 + 3 ×', activeNumber: '8', memory: 8 },
    },
    {
      name: 'M+ empty active with no runningTotal',
      actions: [memoryAdd],
      expected: { expressionLine: '', activeNumber: '', memory: 0 },
    },
    {
      name: 'MR recalls memory into active number',
      actions: [digit(7), memoryAdd, digit(2), memoryRecall],
      expected: { expressionLine: '', activeNumber: '7', memory: 7 },
    },
    {
      name: 'MC clears memory',
      actions: [digit(4), memoryAdd, memoryClear],
      expected: { expressionLine: '', activeNumber: '4', memory: 0 },
    },
    {
      name: 'AC preserves memory',
      actions: [digit(5), memoryAdd, allClear],
      expected: { expressionLine: '', activeNumber: '', memory: 5 },
    },
    {
      name: 'memory survives equals',
      actions: [
        digit(5),
        memoryAdd,
        clear,
        digit(2),
        operator('add'),
        digit(3),
        equals,
      ],
      expected: { expressionLine: '2 + 3 =', activeNumber: '5', memory: 5 },
    },
    {
      name: 'memory ops blocked in error',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        memoryAdd,
        memoryRecall,
        memoryClear,
      ],
      expected: {
        expressionLine: '5 ÷ 0 =',
        activeNumber: 'Error',
        phase: 'error' as const,
        memory: 0,
      },
    },
    {
      name: 'C from error preserves memory',
      actions: [digit(3), memoryAdd, digit(5), operator('divide'), digit(0), equals, clear],
      expected: { expressionLine: '', activeNumber: '', memory: 3 },
    },
  ])('memory: $name', ({ actions, expected }) => {
    const state = runScenario(actions)
    expect(state.expressionLine).toBe(expected.expressionLine)
    expect(state.activeNumber).toBe(expected.activeNumber)
    if ('phase' in expected) {
      expect(state.phase).toBe(expected.phase)
    }
    expect(state.memory).toBe(expected.memory)
  })

  it.each([
    {
      name: '50 → %',
      actions: [digit(5), digit(0), percent],
      expected: { expressionLine: '', activeNumber: '0.5' },
    },
    {
      name: 'negative -25 → %',
      actions: [signToggle, digit(2), digit(5), percent],
      expected: { expressionLine: '', activeNumber: '-0.25' },
    },
    {
      name: 'partial result 5 + 3 × then %',
      actions: [
        digit(5),
        operator('add'),
        digit(3),
        operator('multiply'),
        percent,
      ],
      expected: { expressionLine: '5 + 3 ×', activeNumber: '0.08' },
    },
    {
      name: 'result phase 2 + 3 = then %',
      actions: [
        digit(2),
        operator('add'),
        digit(3),
        equals,
        percent,
      ],
      expected: {
        expressionLine: '2 + 3 =',
        activeNumber: '0.05',
        phase: 'result' as const,
      },
    },
    {
      name: 'empty active mid-chain 5 + then %',
      actions: [digit(5), operator('add'), percent],
      expected: { expressionLine: '5 +', activeNumber: '' },
    },
    {
      name: 'repeat equals cleared after %',
      actions: [
        digit(8),
        operator('add'),
        digit(2),
        equals,
        percent,
        equals,
      ],
      expected: {
        expressionLine: '8 + 2 =',
        activeNumber: '0.1',
        phase: 'result' as const,
      },
    },
    {
      name: '% blocked in error',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        percent,
      ],
      expected: {
        expressionLine: '5 ÷ 0 =',
        activeNumber: 'Error',
        phase: 'error' as const,
      },
    },
    {
      name: '33 → % uses formatDisplay',
      actions: [digit(3), digit(3), percent],
      expected: { expressionLine: '', activeNumber: '0.33' },
    },
  ])('percent: $name', ({ actions, expected }) => {
    const state = runScenario(actions)
    expect(state.expressionLine).toBe(expected.expressionLine)
    expect(state.activeNumber).toBe(expected.activeNumber)
    if ('phase' in expected) {
      expect(state.phase).toBe(expected.phase)
    }
  })

  it.each([
    {
      name: 'delete last digit',
      actions: [digit(1), digit(2), digit(3), backspace],
      expected: { expressionLine: '', activeNumber: '12' },
    },
    {
      name: 'delete from decimal entry',
      actions: [decimal, backspace],
      expected: { expressionLine: '', activeNumber: '0' },
    },
    {
      name: 'lone minus to empty',
      actions: [signToggle, backspace],
      expected: { expressionLine: '', activeNumber: '' },
    },
    {
      name: 'empty active mid-calculation is no-op',
      actions: [digit(5), operator('add'), backspace],
      expected: { expressionLine: '5 +', activeNumber: '' },
    },
    {
      name: 'delete last digit on result',
      actions: [digit(2), operator('add'), digit(3), equals, backspace],
      expected: {
        expressionLine: '2 + 3 =',
        activeNumber: '',
        phase: 'result' as const,
      },
    },
    {
      name: 'empty active on result resets session',
      actions: [digit(2), operator('add'), digit(3), equals, backspace, backspace],
      expected: initialState,
    },
    {
      name: 'partial result edit digit by digit',
      actions: [
        digit(5),
        operator('add'),
        digit(3),
        operator('multiply'),
        backspace,
      ],
      expected: { expressionLine: '5 + 3 ×', activeNumber: '' },
    },
    {
      name: 'backspace blocked in error',
      actions: [
        digit(5),
        operator('divide'),
        digit(0),
        equals,
        backspace,
      ],
      expected: {
        expressionLine: '5 ÷ 0 =',
        activeNumber: 'Error',
        phase: 'error' as const,
      },
    },
  ])('backspace: $name', ({ actions, expected }) => {
    const state = runScenario(actions)
    if (expected === initialState) {
      expect(state).toEqual(initialState)
      return
    }
    expect(state.expressionLine).toBe(expected.expressionLine)
    expect(state.activeNumber).toBe(expected.activeNumber)
    if ('phase' in expected) {
      expect(state.phase).toBe(expected.phase)
    }
  })
})

describe('hasStoredMemory', () => {
  it.each([
    { memory: 0, expected: false },
    { memory: -0, expected: false },
    { memory: 5, expected: true },
    { memory: -3, expected: true },
  ])('memory $memory → $expected', ({ memory, expected }) => {
    expect(hasStoredMemory(memory)).toBe(expected)
  })
})
