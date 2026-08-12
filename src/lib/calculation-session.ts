import { calculate, type Operator } from '@/lib/calculation'
import { formatDisplay } from '@/lib/format-display'

type Phase = 'entry' | 'result'

const TRAILING_GLYPHS = ['+', '−', '×', '÷'] as const

export type CalculationSessionState = {
  phase: Phase
  expressionLine: string
  activeNumber: string
  runningTotal: number | null
  pendingOperator: Operator | null
  lastOperator: Operator | null
  lastSecondOperand: number | null
}

export type CalculationSessionAction =
  | { type: 'digit'; digit: number }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }

export const initialState: CalculationSessionState = {
  phase: 'entry',
  expressionLine: '',
  activeNumber: '',
  runningTotal: null,
  pendingOperator: null,
  lastOperator: null,
  lastSecondOperand: null,
}

export function operatorGlyph(operator: Operator): string {
  switch (operator) {
    case 'add':
      return '+'
    case 'subtract':
      return '−'
    case 'multiply':
      return '×'
    case 'divide':
      return '÷'
    default: {
      const unreachable: never = operator
      throw new Error(`Unknown operator: ${String(unreachable)}`)
    }
  }
}

function appendDigit(current: string, digit: number): string {
  if (current === '0') {
    return digit === 0 ? '0' : String(digit)
  }
  return current + String(digit)
}

function replaceTrailingOperator(expressionLine: string, operator: Operator): string {
  for (const glyph of TRAILING_GLYPHS) {
    if (expressionLine.endsWith(` ${glyph}`)) {
      return (
        expressionLine.slice(0, -(glyph.length + 1)) + ` ${operatorGlyph(operator)}`
      )
    }
  }
  return expressionLine
}

function stripTrailingEquals(expressionLine: string): string {
  if (expressionLine.endsWith('=')) {
    return expressionLine.slice(0, -1).trimEnd()
  }
  return expressionLine
}

export function transition(
  state: CalculationSessionState,
  action: CalculationSessionAction,
): CalculationSessionState {
  switch (action.type) {
    case 'digit': {
      const { digit } = action
      if (state.phase === 'result') {
        return {
          phase: 'entry',
          expressionLine: '',
          activeNumber: appendDigit('', digit),
          runningTotal: null,
          pendingOperator: null,
          lastOperator: null,
          lastSecondOperand: null,
        }
      }

      const showingPartialResult =
        state.pendingOperator !== null &&
        state.runningTotal !== null &&
        state.activeNumber === formatDisplay(state.runningTotal)

      const base = showingPartialResult ? '' : state.activeNumber

      return {
        ...state,
        activeNumber: appendDigit(base, digit),
      }
    }
    case 'operator': {
      const { operator } = action

      if (state.phase === 'result') {
        const total = Number(state.activeNumber)
        return {
          phase: 'entry',
          expressionLine: `${formatDisplay(total)} ${operatorGlyph(operator)}`,
          activeNumber: '',
          runningTotal: total,
          pendingOperator: operator,
          lastOperator: state.lastOperator,
          lastSecondOperand: state.lastSecondOperand,
        }
      }

      if (state.activeNumber === '') {
        if (state.pendingOperator !== null && state.expressionLine !== '') {
          return {
            ...state,
            pendingOperator: operator,
            expressionLine: replaceTrailingOperator(state.expressionLine, operator),
          }
        }
        return state
      }

      const operand = Number(state.activeNumber)

      if (state.pendingOperator === null) {
        return {
          phase: 'entry',
          expressionLine: `${state.activeNumber} ${operatorGlyph(operator)}`,
          activeNumber: '',
          runningTotal: operand,
          pendingOperator: operator,
          lastOperator: null,
          lastSecondOperand: null,
        }
      }

      const result = calculate(
        state.runningTotal!,
        state.pendingOperator,
        operand,
      )
      return {
        phase: 'entry',
        expressionLine: `${state.expressionLine} ${state.activeNumber} ${operatorGlyph(operator)}`,
        activeNumber: formatDisplay(result),
        runningTotal: result,
        pendingOperator: operator,
        lastOperator: state.lastOperator,
        lastSecondOperand: state.lastSecondOperand,
      }
    }
    case 'equals': {
      if (
        state.phase === 'result' &&
        state.lastOperator !== null &&
        state.lastSecondOperand !== null
      ) {
        const current = Number(state.activeNumber)
        const result = calculate(
          current,
          state.lastOperator,
          state.lastSecondOperand,
        )
        const trail = stripTrailingEquals(state.expressionLine)
        const append = ` ${operatorGlyph(state.lastOperator)} ${formatDisplay(
          state.lastSecondOperand,
        )}`
        return {
          ...state,
          expressionLine: trail + append,
          activeNumber: formatDisplay(result),
          runningTotal: result,
        }
      }

      if (
        state.pendingOperator === null ||
        state.activeNumber === '' ||
        state.runningTotal === null
      ) {
        return state
      }

      const operand = Number(state.activeNumber)
      const result = calculate(
        state.runningTotal,
        state.pendingOperator,
        operand,
      )
      return {
        phase: 'result',
        expressionLine: `${state.expressionLine} ${state.activeNumber} =`,
        activeNumber: formatDisplay(result),
        runningTotal: result,
        pendingOperator: null,
        lastOperator: state.pendingOperator,
        lastSecondOperand: operand,
      }
    }
    default:
      return state
  }
}
