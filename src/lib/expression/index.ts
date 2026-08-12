import { evaluate } from './evaluate'
import { parse } from './parse'
import { tokenize } from './tokenize'
import type { AngleUnit, ExpressionResult } from './types'

export type {
  AngleUnit,
  AstNode,
  BinaryOperator,
  ExpressionError,
  ExpressionErrorCode,
  ExpressionResult,
  FunctionName,
} from './types'

export type { ImmediateUnaryName } from './evaluate'
export { applyImmediateUnary, evaluateCall } from './evaluate'

export function evaluateExpression(
  expression: string,
  angleUnit: AngleUnit,
): ExpressionResult {
  const tokenized = tokenize(expression)
  if (!tokenized.ok) {
    return { ok: false, error: tokenized.error }
  }

  const parsed = parse(tokenized.tokens)
  if (!parsed.ok) {
    return { ok: false, error: parsed.error }
  }

  return evaluate(parsed.ast, angleUnit)
}
