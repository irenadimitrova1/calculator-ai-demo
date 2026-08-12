import { useCallback, useReducer } from 'react'

import type { CalculatorMode } from '@/lib/calculator-orchestrator'
import {
  getActiveNumber,
  getExpressionLine,
  hasStoredMemory,
  initialOrchestratorState,
  transition,
  type AngleUnit,
} from '@/lib/calculator-orchestrator'
import type { Operator } from '@/lib/calculation'
import type { ImmediateUnaryName } from '@/lib/expression'

export function useCalculator() {
  const [state, dispatch] = useReducer(transition, initialOrchestratorState)

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

  const pressOpenParen = useCallback(() => {
    dispatch({ type: 'openParen' })
  }, [])

  const pressCloseParen = useCallback(() => {
    dispatch({ type: 'closeParen' })
  }, [])

  const pressConstant = useCallback((name: 'pi' | 'e') => {
    dispatch({ type: 'constant', name })
  }, [])

  const pressPower = useCallback(() => {
    dispatch({ type: 'power' })
  }, [])

  const pressUnaryFunction = useCallback((name: ImmediateUnaryName) => {
    dispatch({ type: 'unaryFunction', name })
  }, [])

  const setMode = useCallback((mode: CalculatorMode) => {
    dispatch({ type: 'setMode', mode })
  }, [])

  const setAngleUnit = useCallback((angleUnit: AngleUnit) => {
    dispatch({ type: 'setAngleUnit', angleUnit })
  }, [])

  return {
    mode: state.mode,
    angleUnit: state.angleUnit,
    expressionLine: getExpressionLine(state),
    activeNumber: getActiveNumber(state),
    hasMemory: hasStoredMemory(state.memory),
    setMode,
    setAngleUnit,
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
    pressOpenParen,
    pressCloseParen,
    pressConstant,
    pressPower,
    pressUnaryFunction,
  }
}
