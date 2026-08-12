import type { Operator } from '@/lib/calculation'

export type CalculatorKeyAction =
  | { type: 'digit'; digit: number }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'backspace' }
  | { type: 'allClear' }

function digitAction(digit: number): CalculatorKeyAction {
  return { type: 'digit', digit }
}

function operatorAction(operator: Operator): CalculatorKeyAction {
  return { type: 'operator', operator }
}

export function mapCalculatorKey(
  event: Pick<KeyboardEvent, 'key' | 'code'>,
): CalculatorKeyAction | null {
  switch (event.code) {
    case 'Numpad0':
      return digitAction(0)
    case 'Numpad1':
      return digitAction(1)
    case 'Numpad2':
      return digitAction(2)
    case 'Numpad3':
      return digitAction(3)
    case 'Numpad4':
      return digitAction(4)
    case 'Numpad5':
      return digitAction(5)
    case 'Numpad6':
      return digitAction(6)
    case 'Numpad7':
      return digitAction(7)
    case 'Numpad8':
      return digitAction(8)
    case 'Numpad9':
      return digitAction(9)
    case 'NumpadDecimal':
      return { type: 'decimal' }
    case 'NumpadAdd':
      return operatorAction('add')
    case 'NumpadSubtract':
      return operatorAction('subtract')
    case 'NumpadMultiply':
      return operatorAction('multiply')
    case 'NumpadDivide':
      return operatorAction('divide')
    case 'NumpadEnter':
      return { type: 'equals' }
    default:
      break
  }

  switch (event.key) {
    case '0':
      return digitAction(0)
    case '1':
      return digitAction(1)
    case '2':
      return digitAction(2)
    case '3':
      return digitAction(3)
    case '4':
      return digitAction(4)
    case '5':
      return digitAction(5)
    case '6':
      return digitAction(6)
    case '7':
      return digitAction(7)
    case '8':
      return digitAction(8)
    case '9':
      return digitAction(9)
    case '.':
      return { type: 'decimal' }
    case '+':
      return operatorAction('add')
    case '-':
      return operatorAction('subtract')
    case '*':
      return operatorAction('multiply')
    case '/':
      return operatorAction('divide')
    case 'Enter':
    case '=':
      return { type: 'equals' }
    case 'Backspace':
      return { type: 'backspace' }
    case 'Escape':
      return { type: 'allClear' }
    default:
      return null
  }
}
