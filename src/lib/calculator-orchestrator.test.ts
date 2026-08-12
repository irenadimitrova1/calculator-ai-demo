import { describe, expect, it } from 'vitest'

import type { Operator } from '@/lib/calculation'
import {
  getActiveNumber,
  getExpressionLine,
  initialOrchestratorState,
  transition,
  type CalculatorOrchestratorAction,
} from '@/lib/calculator-orchestrator'

function digit(d: number): CalculatorOrchestratorAction {
  return { type: 'digit', digit: d }
}

function operator(op: Operator): CalculatorOrchestratorAction {
  return { type: 'operator', operator: op }
}

const equals: CalculatorOrchestratorAction = { type: 'equals' }
const allClear: CalculatorOrchestratorAction = { type: 'allClear' }
const memoryAdd: CalculatorOrchestratorAction = { type: 'memoryAdd' }
const memoryRecall: CalculatorOrchestratorAction = { type: 'memoryRecall' }
const openParen: CalculatorOrchestratorAction = { type: 'openParen' }
const closeParen: CalculatorOrchestratorAction = { type: 'closeParen' }

function runScenario(actions: CalculatorOrchestratorAction[]) {
  return actions.reduce(transition, initialOrchestratorState)
}

describe('calculator orchestrator', () => {
  it('delegates basic mode calculations unchanged', () => {
    const state = runScenario([digit(2), operator('add'), digit(3), equals])

    expect(state.mode).toBe('basic')
    expect(getExpressionLine(state)).toBe('2 + 3 =')
    expect(getActiveNumber(state)).toBe('5')
  })

  it('evaluates PEMDAS expression in scientific mode', () => {
    const state = runScenario([
      { type: 'setMode', mode: 'scientific' },
      openParen,
      digit(2),
      operator('add'),
      digit(3),
      closeParen,
      operator('multiply'),
      digit(4),
      equals,
    ])

    expect(state.mode).toBe('scientific')
    expect(getExpressionLine(state)).toMatch(/=$/)
    expect(getActiveNumber(state)).toBe('20')
  })

  it('clears session when switching modes', () => {
    const state = runScenario([
      digit(5),
      operator('add'),
      digit(3),
      { type: 'setMode', mode: 'scientific' },
    ])

    expect(getExpressionLine(state)).toBe('')
    expect(getActiveNumber(state)).toBe('')
  })

  it('preserves memory across mode switch', () => {
    const state = runScenario([
      digit(5),
      memoryAdd,
      { type: 'setMode', mode: 'scientific' },
      memoryRecall,
    ])

    expect(getActiveNumber(state)).toBe('5')
  })

  it('basic mode still works after switching back from scientific', () => {
    const state = runScenario([
      { type: 'setMode', mode: 'scientific' },
      digit(9),
      { type: 'setMode', mode: 'basic' },
      digit(2),
      operator('add'),
      digit(3),
      equals,
    ])

    expect(getExpressionLine(state)).toBe('2 + 3 =')
    expect(getActiveNumber(state)).toBe('5')
  })

  it('enters error state on scientific divide by zero', () => {
    const state = runScenario([
      { type: 'setMode', mode: 'scientific' },
      digit(1),
      operator('divide'),
      digit(0),
      equals,
    ])

    expect(getActiveNumber(state)).toBe('Error')
    expect(getActiveNumber(transition(state, digit(2)))).toBe('2')
    expect(getActiveNumber(transition(state, allClear))).toBe('')
  })

  it('enters error state on invalid parentheses', () => {
    const state = runScenario([
      { type: 'setMode', mode: 'scientific' },
      openParen,
      digit(2),
      operator('add'),
      digit(3),
      equals,
    ])

    expect(getActiveNumber(state)).toBe('Error')
  })

  it('stores and passes angle unit to scientific evaluation', () => {
    const state = runScenario([
      { type: 'setMode', mode: 'scientific' },
      { type: 'setAngleUnit', angleUnit: 'rad' },
    ])

    expect(state.angleUnit).toBe('rad')
    expect(state.scientific.angleUnit).toBe('rad')
  })

  it('ignores scientific-only actions in basic mode', () => {
    const state = runScenario([
      digit(2),
      openParen,
      closeParen,
      { type: 'constant', name: 'pi' },
      { type: 'power' },
      { type: 'unaryFunction', name: 'sin' },
    ])

    expect(getExpressionLine(state)).toBe('')
    expect(getActiveNumber(state)).toBe('2')
  })

  it('evaluates unary then operator expression in scientific mode', () => {
    const state = runScenario([
      { type: 'setMode', mode: 'scientific' },
      digit(3),
      digit(0),
      { type: 'unaryFunction', name: 'sin' },
      operator('add'),
      digit(3),
      equals,
    ])

    expect(getActiveNumber(state)).toBe('3.5')
    expect(getExpressionLine(state)).toMatch(/=$/)
  })
})
