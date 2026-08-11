export type Operator = 'add' | 'subtract' | 'multiply' | 'divide'

export function calculate(
  left: number,
  operator: Operator,
  right: number,
): number {
  switch (operator) {
    case 'add':
      return left + right
    case 'subtract':
      return left - right
    case 'multiply':
      return left * right
    case 'divide':
      return left / right
    default: {
      const unreachable: never = operator
      throw new Error(`Unknown operator: ${String(unreachable)}`)
    }
  }
}
