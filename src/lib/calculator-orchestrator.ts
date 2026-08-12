import {
  hasStoredMemory,
  initialState as initialBasicState,
  transition as transitionBasic,
  type CalculationSessionAction,
  type CalculationSessionState,
} from '@/lib/calculation-session'
import type { AngleUnit } from '@/lib/expression'
import {
  initialScientificState,
  transitionScientific,
  type ScientificSessionAction,
  type ScientificSessionState,
} from '@/lib/scientific-session'

export type CalculatorMode = 'basic' | 'scientific'

export type { AngleUnit }

export type CalculatorOrchestratorState = {
  mode: CalculatorMode
  angleUnit: AngleUnit
  memory: number
  basic: CalculationSessionState
  scientific: ScientificSessionState
}

export type CalculatorOrchestratorAction =
  | CalculationSessionAction
  | ScientificSessionAction
  | { type: 'setMode'; mode: CalculatorMode }
  | { type: 'setAngleUnit'; angleUnit: AngleUnit }

export const initialOrchestratorState: CalculatorOrchestratorState = {
  mode: 'basic',
  angleUnit: 'deg',
  memory: 0,
  basic: initialBasicState,
  scientific: initialScientificState,
}

function withMemory(
  state: CalculationSessionState,
  memory: number,
): CalculationSessionState {
  return { ...state, memory }
}

function withScientificMemory(
  state: ScientificSessionState,
  memory: number,
  angleUnit: AngleUnit,
): ScientificSessionState {
  return { ...state, memory, angleUnit }
}

function clearedBasic(memory: number): CalculationSessionState {
  return withMemory(initialBasicState, memory)
}

function clearedScientific(
  memory: number,
  angleUnit: AngleUnit,
): ScientificSessionState {
  return withScientificMemory(initialScientificState, memory, angleUnit)
}

function isScientificOnlyAction(
  action: CalculatorOrchestratorAction,
): action is ScientificSessionAction {
  return (
    action.type === 'openParen' ||
    action.type === 'closeParen' ||
    action.type === 'constant' ||
    action.type === 'power' ||
    action.type === 'unaryFunction'
  )
}

export function getExpressionLine(state: CalculatorOrchestratorState): string {
  return state.mode === 'basic'
    ? state.basic.expressionLine
    : state.scientific.expressionLine
}

export function getActiveNumber(state: CalculatorOrchestratorState): string {
  return state.mode === 'basic'
    ? state.basic.activeNumber
    : state.scientific.activeNumber
}

export { hasStoredMemory }

export function transition(
  state: CalculatorOrchestratorState,
  action: CalculatorOrchestratorAction,
): CalculatorOrchestratorState {
  if (action.type === 'setMode') {
    if (action.mode === state.mode) {
      return state
    }
    return {
      ...state,
      mode: action.mode,
      basic: clearedBasic(state.memory),
      scientific: clearedScientific(state.memory, state.angleUnit),
    }
  }

  if (action.type === 'setAngleUnit') {
    return {
      ...state,
      angleUnit: action.angleUnit,
      scientific: withScientificMemory(
        state.scientific,
        state.memory,
        action.angleUnit,
      ),
    }
  }

  if (state.mode === 'basic') {
    if (isScientificOnlyAction(action)) {
      return state
    }

    const basicInput = withMemory(state.basic, state.memory)
    const nextBasic = transitionBasic(basicInput, action)

    return {
      ...state,
      memory: nextBasic.memory,
      basic: nextBasic,
      scientific: withScientificMemory(
        state.scientific,
        nextBasic.memory,
        state.angleUnit,
      ),
    }
  }

  if (isScientificOnlyAction(action)) {
    const nextScientific = transitionScientific(
      withScientificMemory(state.scientific, state.memory, state.angleUnit),
      action,
    )
    return {
      ...state,
      memory: nextScientific.memory,
      scientific: nextScientific,
      basic: withMemory(state.basic, nextScientific.memory),
    }
  }

  const nextScientific = transitionScientific(
    withScientificMemory(state.scientific, state.memory, state.angleUnit),
    action as ScientificSessionAction,
  )

  return {
    ...state,
    memory: nextScientific.memory,
    scientific: nextScientific,
    basic: withMemory(state.basic, nextScientific.memory),
  }
}
