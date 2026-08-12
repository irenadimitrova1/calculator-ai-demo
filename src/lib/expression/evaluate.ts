import type {
  AngleUnit,
  AstNode,
  ExpressionError,
  ExpressionResult,
  FunctionName,
} from './types'

const PI = Math.PI
const E = Math.E

function divideByZeroError(): ExpressionError {
  return { code: 'divide-by-zero' }
}

function logDomainError(): ExpressionError {
  return { code: 'log-domain' }
}

function inverseTrigDomainError(): ExpressionError {
  return { code: 'inverse-trig-domain' }
}

function toRadians(value: number, angleUnit: AngleUnit): number {
  return angleUnit === 'deg' ? (value * Math.PI) / 180 : value
}

function fromRadians(value: number, angleUnit: AngleUnit): number {
  return angleUnit === 'deg' ? (value * 180) / Math.PI : value
}

function evaluateCall(name: FunctionName, argument: number, angleUnit: AngleUnit): ExpressionResult {
  switch (name) {
    case 'sin':
      return { ok: true, value: Math.sin(toRadians(argument, angleUnit)) }
    case 'cos':
      return { ok: true, value: Math.cos(toRadians(argument, angleUnit)) }
    case 'tan': {
      const radians = toRadians(argument, angleUnit)
      const value = Math.tan(radians)
      if (!Number.isFinite(value)) {
        return { ok: false, error: inverseTrigDomainError() }
      }
      return { ok: true, value }
    }
    case 'asin': {
      if (argument < -1 || argument > 1) {
        return { ok: false, error: inverseTrigDomainError() }
      }
      return { ok: true, value: fromRadians(Math.asin(argument), angleUnit) }
    }
    case 'acos': {
      if (argument < -1 || argument > 1) {
        return { ok: false, error: inverseTrigDomainError() }
      }
      return { ok: true, value: fromRadians(Math.acos(argument), angleUnit) }
    }
    case 'atan':
      return { ok: true, value: fromRadians(Math.atan(argument), angleUnit) }
    case 'ln': {
      if (argument <= 0) {
        return { ok: false, error: logDomainError() }
      }
      return { ok: true, value: Math.log(argument) }
    }
    case 'log': {
      if (argument <= 0) {
        return { ok: false, error: logDomainError() }
      }
      return { ok: true, value: Math.log10(argument) }
    }
  }
}

export function evaluate(ast: AstNode, angleUnit: AngleUnit): ExpressionResult {
  switch (ast.type) {
    case 'number':
      return { ok: true, value: ast.value }
    case 'constant':
      return { ok: true, value: ast.name === 'pi' ? PI : E }
    case 'unary': {
      const operand = evaluate(ast.operand, angleUnit)
      if (!operand.ok) {
        return operand
      }
      return { ok: true, value: -operand.value }
    }
    case 'binary': {
      const left = evaluate(ast.left, angleUnit)
      if (!left.ok) {
        return left
      }

      const right = evaluate(ast.right, angleUnit)
      if (!right.ok) {
        return right
      }

      switch (ast.operator) {
        case 'add':
          return { ok: true, value: left.value + right.value }
        case 'subtract':
          return { ok: true, value: left.value - right.value }
        case 'multiply':
          return { ok: true, value: left.value * right.value }
        case 'divide':
          if (right.value === 0) {
            return { ok: false, error: divideByZeroError() }
          }
          return { ok: true, value: left.value / right.value }
        case 'power':
          return { ok: true, value: left.value ** right.value }
        default: {
          const unreachable: never = ast.operator
          throw new Error(`Unknown operator: ${String(unreachable)}`)
        }
      }
    }
    case 'call': {
      const argument = evaluate(ast.argument, angleUnit)
      if (!argument.ok) {
        return argument
      }
      return evaluateCall(ast.name, argument.value, angleUnit)
    }
  }
}
