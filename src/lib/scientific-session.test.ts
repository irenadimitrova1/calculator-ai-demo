import { describe, expect, it } from 'vitest'

import type { Operator } from '@/lib/calculation'
import type { ImmediateUnaryName } from '@/lib/expression'
import { formatDisplay } from '@/lib/format-display'
import {
  initialScientificState,
  transitionScientific,
  type ScientificSessionAction,
} from '@/lib/scientific-session'

function digit(d: number): ScientificSessionAction {
  return { type: 'digit', digit: d }
}

function operator(op: Operator): ScientificSessionAction {
  return { type: 'operator', operator: op }
}

function unary(name: ImmediateUnaryName): ScientificSessionAction {
  return { type: 'unaryFunction', name }
}

const equals: ScientificSessionAction = { type: 'equals' }
const allClear: ScientificSessionAction = { type: 'allClear' }
const percent: ScientificSessionAction = { type: 'percent' }

function runScenario(actions: ScientificSessionAction[]) {
  return actions.reduce(transitionScientific, initialScientificState)
}

describe('scientific session unary functions', () => {
  it('applies sin to active number in degrees', () => {
    const state = runScenario([digit(3), digit(0), unary('sin')])

    expect(state.activeNumber).toBe('0.5')
    expect(state.expressionLine).toBe('')
    expect(state.phase).toBe('entry')
  })

  it('no-ops unary on empty active number', () => {
    const before = initialScientificState
    const after = transitionScientific(before, unary('sin'))

    expect(after).toEqual(before)
  })

  it('chains immediate unaries on active number', () => {
    const state = runScenario([
      digit(4),
      unary('square'),
      unary('sqrt'),
      unary('reciprocal'),
    ])

    expect(state.activeNumber).toBe('0.25')
  })

  it('enters error state for log of zero', () => {
    const state = runScenario([digit(0), unary('ln')])

    expect(state.activeNumber).toBe('Error')
    expect(state.phase).toBe('error')
  })

  it('enters error state for reciprocal of zero', () => {
    const state = runScenario([digit(0), unary('reciprocal')])

    expect(state.activeNumber).toBe('Error')
    expect(state.phase).toBe('error')
  })

  it('applies unary to result phase operand', () => {
    const state = runScenario([
      digit(5),
      equals,
      unary('square'),
    ])

    expect(state.activeNumber).toBe('25')
    expect(state.phase).toBe('entry')
    expect(state.expressionLine).toBe('')
  })

  it('applies percent before unary on active number', () => {
    const state = runScenario([digit(2), percent, unary('sin')])
    const expected = formatDisplay(Math.sin((0.02 * Math.PI) / 180))

    expect(state.activeNumber).toBe(expected)
  })

  it('recovers from error on digit input', () => {
    const errorState = runScenario([digit(0), unary('ln')])
    const recovered = transitionScientific(errorState, digit(2))

    expect(recovered.activeNumber).toBe('2')
    expect(recovered.phase).toBe('entry')
  })

  it('builds PEMDAS expression after unary then operator', () => {
    const state = runScenario([
      digit(3),
      digit(0),
      unary('sin'),
      operator('add'),
      digit(3),
      equals,
    ])

    expect(state.activeNumber).toBe('3.5')
    expect(state.expressionLine).toMatch(/=$/)
  })
})

describe('scientific session unary functions — direct negative sqrt', () => {
  it('enters error state for square root of negative number', () => {
    const state = runScenario([
      { type: 'signToggle' },
      digit(1),
      unary('sqrt'),
    ])

    expect(state.activeNumber).toBe('Error')
    expect(state.phase).toBe('error')
  })
})
