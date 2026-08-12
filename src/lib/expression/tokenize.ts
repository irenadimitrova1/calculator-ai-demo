import type { ExpressionError, FunctionName, Token, TokenizeResult } from './types'

const FUNCTION_ALIASES: ReadonlyArray<{ pattern: string; name: FunctionName }> = [
  { pattern: 'sin⁻¹', name: 'asin' },
  { pattern: 'cos⁻¹', name: 'acos' },
  { pattern: 'tan⁻¹', name: 'atan' },
  { pattern: 'asin', name: 'asin' },
  { pattern: 'acos', name: 'acos' },
  { pattern: 'atan', name: 'atan' },
  { pattern: 'sin', name: 'sin' },
  { pattern: 'cos', name: 'cos' },
  { pattern: 'tan', name: 'tan' },
  { pattern: 'ln', name: 'ln' },
  { pattern: 'log', name: 'log' },
]

function syntaxError(message?: string): ExpressionError {
  return { code: 'syntax', message }
}

function isWhitespace(char: string): boolean {
  return /\s/.test(char)
}

function isDigit(char: string): boolean {
  return char >= '0' && char <= '9'
}

function readNumber(input: string, start: number): { value: number; next: number } | null {
  let index = start
  let sawDot = false

  while (index < input.length) {
    const char = input[index]!
    if (isDigit(char)) {
      index += 1
      continue
    }
    if (char === '.' && !sawDot) {
      sawDot = true
      index += 1
      continue
    }
    break
  }

  if (index === start || (index === start + 1 && input[start] === '.')) {
    return null
  }

  const value = Number(input.slice(start, index))
  if (!Number.isFinite(value)) {
    return null
  }

  return { value, next: index }
}

function readFunction(input: string, start: number): { name: FunctionName; next: number } | null {
  for (const alias of FUNCTION_ALIASES) {
    if (input.startsWith(alias.pattern, start)) {
      const next = start + alias.pattern.length
      const nextChar = input[next]
      if (nextChar !== undefined && /[A-Za-z0-9⁻¹]/.test(nextChar)) {
        continue
      }
      return { name: alias.name, next }
    }
  }
  return null
}

export function tokenize(input: string): TokenizeResult {
  const tokens: Token[] = []
  let index = 0

  while (index < input.length) {
    const char = input[index]!

    if (isWhitespace(char)) {
      index += 1
      continue
    }

    const numberMatch = readNumber(input, index)
    if (numberMatch) {
      tokens.push({ type: 'number', value: numberMatch.value })
      index = numberMatch.next
      continue
    }

    const functionMatch = readFunction(input, index)
    if (functionMatch) {
      tokens.push({ type: 'function', name: functionMatch.name })
      index = functionMatch.next
      continue
    }

    if (char === 'π') {
      tokens.push({ type: 'constant', name: 'pi' })
      index += 1
      continue
    }

    if (char === 'e') {
      tokens.push({ type: 'constant', name: 'e' })
      index += 1
      continue
    }

    if (char === '(') {
      tokens.push({ type: 'lparen' })
      index += 1
      continue
    }

    if (char === ')') {
      tokens.push({ type: 'rparen' })
      index += 1
      continue
    }

    if (char === '+' || char === '−' || char === '×' || char === '÷' || char === '^') {
      tokens.push({ type: 'operator', value: char })
      index += 1
      continue
    }

    return { ok: false, error: syntaxError(`Unexpected character: ${char}`) }
  }

  tokens.push({ type: 'eof' })
  return { ok: true, tokens }
}
