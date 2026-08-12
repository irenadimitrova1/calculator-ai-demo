import { useCallback, useReducer } from 'react'

import {
  hasStoredMemory,
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

  const pressAllClear = useCallback(() => {
    dispatch({ type: 'allClear' })
  }, [])

  const pressClear = useCallback(() => {
    dispatch({ type: 'clear' })
  }, [])

  const pressDecimal = useCallback(() => {
    dispatch({ type: 'decimal' })
  }, [])

  const pressSignToggle = useCallback(() => {
    dispatch({ type: 'signToggle' })
  }, [])

  const pressPercent = useCallback(() => {
    dispatch({ type: 'percent' })
  }, [])

  const pressMemoryClear = useCallback(() => {
    dispatch({ type: 'memoryClear' })
  }, [])

  const pressMemoryRecall = useCallback(() => {
    dispatch({ type: 'memoryRecall' })
  }, [])

  const pressMemoryAdd = useCallback(() => {
    dispatch({ type: 'memoryAdd' })
  }, [])

  const pressMemorySubtract = useCallback(() => {
    dispatch({ type: 'memorySubtract' })
  }, [])

  const pressBackspace = useCallback(() => {
    dispatch({ type: 'backspace' })
  }, [])

  return {
    expressionLine: state.expressionLine,
    activeNumber: state.activeNumber,
    hasMemory: hasStoredMemory(state.memory),
    pressDigit,
    pressOperator,
    pressEquals,
    pressAllClear,
    pressClear,
    pressDecimal,
    pressSignToggle,
    pressPercent,
    pressMemoryClear,
    pressMemoryRecall,
    pressMemoryAdd,
    pressMemorySubtract,
    pressBackspace,
  }
}
