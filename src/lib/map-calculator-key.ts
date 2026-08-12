import type { CalculatorMode } from '@/lib/calculator-orchestrator'
import type { Operator } from '@/lib/calculation'
import type { ImmediateUnaryName } from '@/lib/expression'

export type CalculatorKeyAction =
  | { type: 'digit'; digit: number }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'backspace' }
  | { type: 'allClear' }
  | { type: 'openParen' }
  | { type: 'closeParen' }
  | { type: 'power' }
  | { type: 'constant'; name: 'pi' | 'e' }
  | { type: 'unaryFunction'; name: ImmediateUnaryName }

function digitAction(digit: number): CalculatorKeyAction {
  return { type: 'digit', digit }
}

function operatorAction(operator: Operator): CalculatorKeyAction {
  return { type: 'operator', operator }
}

function unaryAction(name: ImmediateUnaryName): CalculatorKeyAction {
  return { type: 'unaryFunction', name }
}

function mapScientificKey(
  event: Pick<KeyboardEvent, 'key' | 'shiftKey'>,
): CalculatorKeyAction | null {
  if (event.shiftKey) {
    switch (event.key.toLowerCase()) {
      case 's':
        return unaryAction('asin')
      case 'c':
        return unaryAction('acos')
      case 't':
        return unaryAction('atan')
      default:
        return null
    }
  }

  switch (event.key) {
    case '(':
      return { type: 'openParen' }
    case ')':
      return { type: 'closeParen' }
    case '^':
      return { type: 'power' }
    case 's':
      return unaryAction('sin')
    case 'c':
      return unaryAction('cos')
    case 't':
      return unaryAction('tan')
    case 'l':
      return unaryAction('ln')
    case 'g':
      return unaryAction('log')
    case 'p':
      return { type: 'constant', name: 'pi' }
    case 'e':
      return { type: 'constant', name: 'e' }
    case 'r':
      return unaryAction('sqrt')
    case 'q':
      return unaryAction('square')
    default:
      return null
  }
}

export function mapCalculatorKey(
  event: Pick<KeyboardEvent, 'key' | 'code' | 'shiftKey'>,
  mode: CalculatorMode = 'basic',
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
      if (mode === 'scientific') {
        return mapScientificKey(event)
      }
      return null
  }
}
