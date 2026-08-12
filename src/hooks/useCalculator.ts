import { useCallback, useReducer } from 'react'

import {
  initialState,
  transition,
} from '@/lib/calculation-session'
import type { Operator } from '@/lib/calculation'

export function useCalculator() {
  const [state, dispatch] = useReducer(transition, initialState)

  const pressDigit = useCallback((digit: number) => {
    dispatch({ type: 'digit', digit })
  }, [])

  const pressOperator = useCallback((operator: Operator) => {
    dispatch({ type: 'operator', operator })
  }, [])

  const pressEquals = useCallback(() => {
    dispatch({ type: 'equals' })
  }, [])

  return {
    expressionLine: state.expressionLine,
    activeNumber: state.activeNumber,
    pressDigit,
    pressOperator,
    pressEquals,
  }
}
