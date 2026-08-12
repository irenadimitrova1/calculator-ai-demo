import { calculate, type Operator } from '@/lib/calculation'

type Phase = 'firstOperand' | 'secondOperand' | 'result'

export type CalculationSessionState = {
  phase: Phase
  firstOperand: number | null
  operator: Operator | null
  topLine: string
  bottomLine: string
}

export type CalculationSessionAction =
  | { type: 'digit'; digit: number }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }

export const initialState: CalculationSessionState = {
  phase: 'firstOperand',
  firstOperand: null,
  operator: null,
  topLine: '',
  bottomLine: '',
}

function appendDigit(current: string, digit: number): string {
  if (current === '0') {
    return digit === 0 ? '0' : String(digit)
  }
  return current + String(digit)
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
          phase: 'firstOperand',
          firstOperand: null,
          operator: null,
          topLine: String(digit),
          bottomLine: '',
        }
      }
      return {
        ...state,
        topLine: appendDigit(state.topLine, digit),
      }
    }
    case 'operator': {
      const { operator } = action
      if (state.phase === 'result') {
        const first = Number(state.bottomLine)
        return {
          phase: 'secondOperand',
          firstOperand: first,
          operator,
          topLine: '',
          bottomLine: '',
        }
      }
      if (state.phase === 'firstOperand') {
        if (state.topLine === '') return state
        return {
          phase: 'secondOperand',
          firstOperand: Number(state.topLine),
          operator,
          topLine: '',
          bottomLine: '',
        }
      }
      if (state.topLine === '') {
        return { ...state, operator }
      }
      return state
    }
    case 'equals': {
      if (
        state.phase !== 'secondOperand' ||
        state.topLine === '' ||
        state.firstOperand === null ||
        state.operator === null
      ) {
        return state
      }
      const result = calculate(
        state.firstOperand,
        state.operator,
        Number(state.topLine),
      )
      return {
        phase: 'result',
        firstOperand: result,
        operator: null,
        topLine: '',
        bottomLine: String(result),
      }
    }
    default:
      return state
  }
}
