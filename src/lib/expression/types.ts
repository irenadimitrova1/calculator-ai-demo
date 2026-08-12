export type AngleUnit = 'deg' | 'rad'

export type ExpressionErrorCode =
  | 'syntax'
  | 'divide-by-zero'
  | 'log-domain'
  | 'inverse-trig-domain'

export type ExpressionError = {
  code: ExpressionErrorCode
  message?: string
}

export type ExpressionResult =
  | { ok: true; value: number }
  | { ok: false; error: ExpressionError }

export type FunctionName =
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
  | 'ln'
  | 'log'

export type BinaryOperator = 'add' | 'subtract' | 'multiply' | 'divide' | 'power'

export type AstNode =
  | { type: 'number'; value: number }
  | { type: 'constant'; name: 'pi' | 'e' }
  | { type: 'unary'; operator: 'neg'; operand: AstNode }
  | {
      type: 'binary'
      operator: BinaryOperator
      left: AstNode
      right: AstNode
    }
  | { type: 'call'; name: FunctionName; argument: AstNode }

export type Token =
  | { type: 'number'; value: number }
  | { type: 'constant'; name: 'pi' | 'e' }
  | { type: 'operator'; value: '+' | '−' | '×' | '÷' | '^' }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'function'; name: FunctionName }
  | { type: 'eof' }

export type TokenizeResult =
  | { ok: true; tokens: Token[] }
  | { ok: false; error: ExpressionError }

export type ParseResult =
  | { ok: true; ast: AstNode }
  | { ok: false; error: ExpressionError }
