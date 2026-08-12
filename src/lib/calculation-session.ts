import { calculate, type Operator } from '@/lib/calculation'
import { formatDisplay } from '@/lib/format-display'

type Phase = 'entry' | 'result' | 'error'

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
  | { type: 'allClear' }
  | { type: 'clear' }
  | { type: 'decimal' }
  | { type: 'signToggle' }

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

function isActiveEmpty(activeNumber: string): boolean {
  return activeNumber === '' || activeNumber === '-'
}

function isShowingPartialResult(state: CalculationSessionState): boolean {
  return (
    state.pendingOperator !== null &&
    state.runningTotal !== null &&
    state.activeNumber === formatDisplay(state.runningTotal)
  )
}

function resolveActiveEntryBase(state: CalculationSessionState): string {
  return isShowingPartialResult(state) ? '' : state.activeNumber
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

function enterErrorState(
  state: CalculationSessionState,
  expressionLine: string,
): CalculationSessionState {
  return {
    ...state,
    phase: 'error',
    expressionLine,
    activeNumber: 'Error',
    runningTotal: null,
    pendingOperator: null,
    lastOperator: null,
    lastSecondOperand: null,
  }
}

function toggleSign(activeNumber: string): string {
  if (activeNumber === '') {
    return '-'
  }
  if (activeNumber === '-') {
    return ''
  }
  if (activeNumber.startsWith('-')) {
    return activeNumber.slice(1)
  }
  return `-${activeNumber}`
}

function appendDecimal(base: string): string {
  if (base.includes('.')) {
    return base
  }
  if (base === '') {
    return '0.'
  }
  if (base === '-') {
    return '-0.'
  }
  return `${base}.`
}

export function transition(
  state: CalculationSessionState,
  action: CalculationSessionAction,
): CalculationSessionState {
  if (state.phase === 'error') {
    if (action.type === 'allClear' || action.type === 'clear') {
      return initialState
    }
    return state
  }

  switch (action.type) {
    case 'allClear':
      return initialState
    case 'clear': {
      if (state.phase === 'result') {
        return initialState
      }
      if (isActiveEmpty(state.activeNumber)) {
        return state
      }
      return {
        ...state,
        activeNumber: '',
      }
    }
    case 'decimal': {
      if (state.phase === 'result') {
        return {
          phase: 'entry',
          expressionLine: '',
          activeNumber: '0.',
          runningTotal: null,
          pendingOperator: null,
          lastOperator: null,
          lastSecondOperand: null,
        }
      }

      const base = resolveActiveEntryBase(state)
      if (base.includes('.')) {
        return state
      }

      return {
        ...state,
        activeNumber: appendDecimal(base),
      }
    }
    case 'signToggle': {
      return {
        ...state,
        activeNumber: toggleSign(state.activeNumber),
      }
    }
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

      const base = resolveActiveEntryBase(state)

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

      if (isActiveEmpty(state.activeNumber)) {
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

      const expressionLine = `${state.expressionLine} ${state.activeNumber} ${operatorGlyph(operator)}`
      const result = calculate(
        state.runningTotal!,
        state.pendingOperator,
        operand,
      )
      if (!Number.isFinite(result)) {
        return enterErrorState(state, expressionLine)
      }
      return {
        phase: 'entry',
        expressionLine,
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
        const trail = stripTrailingEquals(state.expressionLine)
        const append = ` ${operatorGlyph(state.lastOperator)} ${formatDisplay(
          state.lastSecondOperand,
        )}`
        const expressionLine = trail + append
        const result = calculate(
          current,
          state.lastOperator,
          state.lastSecondOperand,
        )
        if (!Number.isFinite(result)) {
          return enterErrorState(state, `${expressionLine} =`)
        }
        return {
          ...state,
          expressionLine,
          activeNumber: formatDisplay(result),
          runningTotal: result,
        }
      }

      if (
        state.pendingOperator === null ||
        isActiveEmpty(state.activeNumber) ||
        state.runningTotal === null
      ) {
        return state
      }

      const operand = Number(state.activeNumber)
      const expressionLine = `${state.expressionLine} ${state.activeNumber} =`
      const result = calculate(
        state.runningTotal,
        state.pendingOperator,
        operand,
      )
      if (!Number.isFinite(result)) {
        return enterErrorState(state, expressionLine)
      }
      return {
        phase: 'result',
        expressionLine,
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
