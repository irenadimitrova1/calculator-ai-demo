import type { Operator } from '@/lib/calculation'
import { operatorGlyph } from '@/lib/calculation-session'
import { evaluateExpression, type AngleUnit } from '@/lib/expression'
import { formatDisplay } from '@/lib/format-display'

type Phase = 'entry' | 'result' | 'error'

const TRAILING_OPERATORS = ['+', '−', '×', '÷', '^'] as const
const TRAILING_CONSTANTS = ['π', 'e'] as const

export type ScientificSessionState = {
  phase: Phase
  expressionLine: string
  activeNumber: string
  memory: number
  angleUnit: AngleUnit
}

export type ScientificSessionAction =
  | { type: 'digit'; digit: number }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'allClear' }
  | { type: 'clear' }
  | { type: 'decimal' }
  | { type: 'signToggle' }
  | { type: 'percent' }
  | { type: 'memoryClear' }
  | { type: 'memoryRecall' }
  | { type: 'memoryAdd' }
  | { type: 'memorySubtract' }
  | { type: 'backspace' }
  | { type: 'openParen' }
  | { type: 'closeParen' }
  | { type: 'constant'; name: 'pi' | 'e' }
  | { type: 'power' }
  | { type: 'setAngleUnit'; angleUnit: AngleUnit }

export const initialScientificState: ScientificSessionState = {
  phase: 'entry',
  expressionLine: '',
  activeNumber: '',
  memory: 0,
  angleUnit: 'deg',
}

function isActiveEmpty(activeNumber: string): boolean {
  return activeNumber === '' || activeNumber === '-'
}

function appendDigit(current: string, digit: number): string {
  if (current === '0') {
    return digit === 0 ? '0' : String(digit)
  }
  return current + String(digit)
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

function clearedSession(
  memory: number,
  angleUnit: AngleUnit,
): ScientificSessionState {
  return { ...initialScientificState, memory, angleUnit }
}

function joinExpression(left: string, token: string): string {
  if (left === '') {
    return token
  }
  return `${left} ${token}`
}

function flushActiveNumber(state: ScientificSessionState): ScientificSessionState {
  if (isActiveEmpty(state.activeNumber)) {
    return state
  }
  return {
    ...state,
    expressionLine: joinExpression(state.expressionLine, state.activeNumber),
    activeNumber: '',
  }
}

function replaceTrailingOperator(
  expressionLine: string,
  operator: Operator,
): string {
  for (const glyph of TRAILING_OPERATORS) {
    if (expressionLine.endsWith(` ${glyph}`)) {
      return (
        expressionLine.slice(0, -(glyph.length + 1)) + ` ${operatorGlyph(operator)}`
      )
    }
  }
  return expressionLine
}

function peelLastToken(expressionLine: string): string {
  if (expressionLine === '') {
    return expressionLine
  }

  for (const glyph of TRAILING_OPERATORS) {
    if (expressionLine.endsWith(` ${glyph}`)) {
      return expressionLine.slice(0, -(glyph.length + 1))
    }
  }

  if (expressionLine.endsWith(')')) {
    return expressionLine.slice(0, -1)
  }

  for (const constant of TRAILING_CONSTANTS) {
    if (expressionLine.endsWith(` ${constant}`)) {
      return expressionLine.slice(0, -(constant.length + 1))
    }
    if (expressionLine === constant) {
      return ''
    }
  }

  if (expressionLine.endsWith('(')) {
    return expressionLine.slice(0, -1)
  }

  const lastSpace = expressionLine.lastIndexOf(' ')
  if (lastSpace === -1) {
    return ''
  }

  return expressionLine.slice(0, lastSpace)
}

function buildEvalExpression(state: ScientificSessionState): string {
  if (isActiveEmpty(state.activeNumber)) {
    return state.expressionLine.trim()
  }
  return joinExpression(state.expressionLine, state.activeNumber).trim()
}

function enterErrorState(
  state: ScientificSessionState,
  expressionLine: string,
): ScientificSessionState {
  return {
    ...state,
    phase: 'error',
    expressionLine,
    activeNumber: 'Error',
  }
}

function resolveMemoryOperand(state: ScientificSessionState): number {
  if (!isActiveEmpty(state.activeNumber)) {
    return Number(state.activeNumber)
  }
  return 0
}

function isErrorRecoverableAction(action: ScientificSessionAction): boolean {
  return (
    action.type === 'digit' ||
    action.type === 'decimal' ||
    action.type === 'operator' ||
    action.type === 'signToggle' ||
    action.type === 'openParen' ||
    action.type === 'closeParen' ||
    action.type === 'constant' ||
    action.type === 'power'
  )
}

function recoverFromError(
  state: ScientificSessionState,
  action: ScientificSessionAction,
): ScientificSessionState {
  return transitionScientific(clearedSession(state.memory, state.angleUnit), action)
}

function appendOperatorToken(
  state: ScientificSessionState,
  operator: Operator,
): ScientificSessionState {
  if (state.phase === 'result') {
    const total = state.activeNumber
    return {
      ...state,
      phase: 'entry',
      expressionLine: `${total} ${operatorGlyph(operator)}`,
      activeNumber: '',
    }
  }

  if (isActiveEmpty(state.activeNumber)) {
    if (state.expressionLine !== '') {
      const replaced = replaceTrailingOperator(state.expressionLine, operator)
      if (replaced !== state.expressionLine) {
        return { ...state, expressionLine: replaced }
      }
      return {
        ...state,
        expressionLine: joinExpression(
          state.expressionLine,
          operatorGlyph(operator),
        ),
      }
    }
    return state
  }

  const flushed = flushActiveNumber(state)
  return {
    ...flushed,
    expressionLine: joinExpression(flushed.expressionLine, operatorGlyph(operator)),
  }
}

function constantGlyph(name: 'pi' | 'e'): string {
  return name === 'pi' ? 'π' : 'e'
}

export function transitionScientific(
  state: ScientificSessionState,
  action: ScientificSessionAction,
): ScientificSessionState {
  if (state.phase === 'error') {
    if (action.type === 'allClear' || action.type === 'clear') {
      return clearedSession(state.memory, state.angleUnit)
    }
    if (isErrorRecoverableAction(action)) {
      return recoverFromError(state, action)
    }
    return state
  }

  switch (action.type) {
    case 'setAngleUnit':
      return { ...state, angleUnit: action.angleUnit }
    case 'allClear':
      return clearedSession(state.memory, state.angleUnit)
    case 'clear': {
      if (state.phase === 'result') {
        return clearedSession(state.memory, state.angleUnit)
      }
      if (isActiveEmpty(state.activeNumber)) {
        return state
      }
      return { ...state, activeNumber: '' }
    }
    case 'decimal': {
      if (state.phase === 'result') {
        return {
          ...clearedSession(state.memory, state.angleUnit),
          activeNumber: '0.',
        }
      }
      const base = state.activeNumber
      if (base.includes('.')) {
        return state
      }
      return { ...state, activeNumber: appendDecimal(base) }
    }
    case 'signToggle':
      return { ...state, activeNumber: toggleSign(state.activeNumber) }
    case 'percent': {
      if (isActiveEmpty(state.activeNumber)) {
        return state
      }
      return {
        ...state,
        activeNumber: formatDisplay(Number(state.activeNumber) / 100),
      }
    }
    case 'digit': {
      if (state.phase === 'result') {
        return {
          ...clearedSession(state.memory, state.angleUnit),
          activeNumber: appendDigit('', action.digit),
        }
      }
      return {
        ...state,
        activeNumber: appendDigit(state.activeNumber, action.digit),
      }
    }
    case 'operator':
      return appendOperatorToken(state, action.operator)
    case 'openParen': {
      if (state.phase === 'result') {
        return {
          ...clearedSession(state.memory, state.angleUnit),
          expressionLine: '(',
        }
      }
      const flushed = flushActiveNumber(state)
      return {
        ...flushed,
        expressionLine: joinExpression(flushed.expressionLine, '('),
      }
    }
    case 'closeParen': {
      const flushed = flushActiveNumber(state)
      return {
        ...flushed,
        expressionLine: joinExpression(flushed.expressionLine, ')'),
      }
    }
    case 'constant': {
      if (state.phase === 'result') {
        return {
          ...clearedSession(state.memory, state.angleUnit),
          expressionLine: constantGlyph(action.name),
        }
      }
      const flushed = flushActiveNumber(state)
      return {
        ...flushed,
        expressionLine: joinExpression(
          flushed.expressionLine,
          constantGlyph(action.name),
        ),
      }
    }
    case 'power': {
      if (state.phase === 'result') {
        return {
          ...state,
          phase: 'entry',
          expressionLine: `${state.activeNumber} ^`,
          activeNumber: '',
        }
      }
      const flushed = flushActiveNumber(state)
      return {
        ...flushed,
        expressionLine: joinExpression(flushed.expressionLine, '^'),
      }
    }
    case 'equals': {
      const evalExpression = buildEvalExpression(state)
      if (evalExpression === '') {
        return state
      }

      const result = evaluateExpression(evalExpression, state.angleUnit)
      const expressionLine = `${evalExpression} =`

      if (!result.ok) {
        return enterErrorState(state, expressionLine)
      }

      if (!Number.isFinite(result.value)) {
        return enterErrorState(state, expressionLine)
      }

      return {
        ...state,
        phase: 'result',
        expressionLine,
        activeNumber: formatDisplay(result.value),
      }
    }
    case 'memoryClear':
      return { ...state, memory: 0 }
    case 'memoryRecall':
      return { ...state, activeNumber: formatDisplay(state.memory) }
    case 'memoryAdd':
      return {
        ...state,
        memory: state.memory + resolveMemoryOperand(state),
      }
    case 'memorySubtract':
      return {
        ...state,
        memory: state.memory - resolveMemoryOperand(state),
      }
    case 'backspace': {
      if (!isActiveEmpty(state.activeNumber)) {
        return {
          ...state,
          activeNumber: state.activeNumber.slice(0, -1),
        }
      }
      if (state.phase === 'result') {
        return clearedSession(state.memory, state.angleUnit)
      }
      return {
        ...state,
        expressionLine: peelLastToken(state.expressionLine),
      }
    }
    default:
      return state
  }
}
