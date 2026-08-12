import type {
  AstNode,
  BinaryOperator,
  ExpressionError,
  ParseResult,
  Token,
} from './types'

function syntaxError(message?: string): ExpressionError {
  return { code: 'syntax', message }
}

class Parser {
  private index = 0
  private readonly tokens: Token[]

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parse(): ParseResult {
    if (this.peek().type === 'eof') {
      return { ok: false, error: syntaxError('Empty expression') }
    }

    const expression = this.parseExpression(0)
    if (!expression.ok) {
      return expression
    }

    if (this.peek().type !== 'eof') {
      return { ok: false, error: syntaxError('Unexpected token after expression') }
    }

    return { ok: true, ast: expression.ast }
  }

  private peek(): Token {
    return this.tokens[this.index] ?? { type: 'eof' }
  }

  private advance(): Token {
    const token = this.peek()
    if (token.type !== 'eof') {
      this.index += 1
    }
    return token
  }

  private parseExpression(minPrecedence: number): ParseResult & { ast?: AstNode } {
    const prefix = this.parsePrefix()
    if (!prefix.ok) {
      return prefix
    }

    let left: AstNode = prefix.ast!

    while (true) {
      const token = this.peek()
      if (token.type !== 'operator') {
        break
      }

      const precedence = binaryPrecedence(token.value)
      if (precedence < minPrecedence) {
        break
      }

      const operator = token.value
      const nextMinPrecedence =
        operator === '^' ? precedence : precedence + 1

      this.advance()

      const right = this.parseExpression(nextMinPrecedence)
      if (!right.ok) {
        return right
      }

      left = {
        type: 'binary',
        operator: operatorToBinary(operator),
        left,
        right: right.ast!,
      }
    }

    return { ok: true, ast: left }
  }

  private parsePrefix(): ParseResult & { ast?: AstNode } {
    const token = this.peek()

    if (token.type === 'operator' && token.value === '−') {
      this.advance()
      const operand = this.parseExpression(4)
      if (!operand.ok) {
        return operand
      }
      return {
        ok: true,
        ast: { type: 'unary', operator: 'neg', operand: operand.ast! },
      }
    }

    return this.parsePrimary()
  }

  private parsePrimary(): ParseResult & { ast?: AstNode } {
    const token = this.peek()

    if (token.type === 'number') {
      this.advance()
      return { ok: true, ast: { type: 'number', value: token.value } }
    }

    if (token.type === 'constant') {
      this.advance()
      return { ok: true, ast: { type: 'constant', name: token.name } }
    }

    if (token.type === 'function') {
      const name = token.name
      this.advance()

      if (this.peek().type !== 'lparen') {
        return { ok: false, error: syntaxError(`Expected '(' after ${name}`) }
      }

      this.advance()
      const argument = this.parseExpression(0)
      if (!argument.ok) {
        return argument
      }

      if (this.peek().type !== 'rparen') {
        return { ok: false, error: syntaxError(`Expected ')' after ${name} argument`) }
      }

      this.advance()
      return { ok: true, ast: { type: 'call', name, argument: argument.ast! } }
    }

    if (token.type === 'lparen') {
      this.advance()
      const inner = this.parseExpression(0)
      if (!inner.ok) {
        return inner
      }

      if (this.peek().type !== 'rparen') {
        return { ok: false, error: syntaxError('Unbalanced parentheses') }
      }

      this.advance()
      return { ok: true, ast: inner.ast! }
    }

    if (token.type === 'eof') {
      return { ok: false, error: syntaxError('Unexpected end of expression') }
    }

    return { ok: false, error: syntaxError('Unexpected token') }
  }
}

function binaryPrecedence(operator: '+' | '−' | '×' | '÷' | '^'): number {
  switch (operator) {
    case '+':
    case '−':
      return 1
    case '×':
    case '÷':
      return 2
    case '^':
      return 3
  }
}

function operatorToBinary(operator: '+' | '−' | '×' | '÷' | '^'): BinaryOperator {
  switch (operator) {
    case '+':
      return 'add'
    case '−':
      return 'subtract'
    case '×':
      return 'multiply'
    case '÷':
      return 'divide'
    case '^':
      return 'power'
  }
}

export function parse(tokens: Token[]): ParseResult {
  return new Parser(tokens).parse()
}
