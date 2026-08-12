import { useCallback } from 'react'

import { Display } from '@/components/calculator/Display'
import { Keypad } from '@/components/calculator/Keypad'
import { Card, CardContent } from '@/components/ui/card'
import { useCalculator } from '@/hooks/useCalculator'
import { mapCalculatorKey } from '@/lib/map-calculator-key'

export function Calculator() {
  const {
    expressionLine,
    activeNumber,
    hasMemory,
    pressDigit,
    pressOperator,
    pressEquals,
    pressAllClear,
    pressClear,
    pressDecimal,
    pressSignToggle,
    pressPercent,
    pressMemoryClear,
    pressMemoryRecall,
    pressMemoryAdd,
    pressMemorySubtract,
    pressBackspace,
  } = useCalculator()

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const action = mapCalculatorKey(event)
      if (action === null) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      switch (action.type) {
        case 'digit':
          pressDigit(action.digit)
          break
        case 'decimal':
          pressDecimal()
          break
        case 'operator':
          pressOperator(action.operator)
          break
        case 'equals':
          pressEquals()
          break
        case 'backspace':
          pressBackspace()
          break
        case 'allClear':
          pressAllClear()
          break
        default: {
          const unreachable: never = action
          throw new Error(`Unknown key action: ${String(unreachable)}`)
        }
      }
    },
    [
      pressAllClear,
      pressBackspace,
      pressDecimal,
      pressDigit,
      pressEquals,
      pressOperator,
    ],
  )

  return (
    // Calculator keyboard surface — v1 spec requires auto-focus and key capture on load
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- role application + tabIndex is the standard calculator widget pattern
    <div
      aria-label="Calculator"
      autoFocus // eslint-disable-line jsx-a11y/no-autofocus -- v1 spec: keyboard works immediately on load
      className="outline-none"
      onKeyDown={handleKeyDown}
      role="application"
      tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex -- focus target for keyboard input
    >
      <Card className="w-full max-w-xs">
        <CardContent className="flex flex-col gap-4">
          <Display
            activeNumber={activeNumber}
            expressionLine={expressionLine}
            hasMemory={hasMemory}
          />
          <Keypad
            onAllClear={pressAllClear}
            onClear={pressClear}
            onDecimal={pressDecimal}
            onDigit={pressDigit}
            onEquals={pressEquals}
            onMemoryAdd={pressMemoryAdd}
            onMemoryClear={pressMemoryClear}
            onMemoryRecall={pressMemoryRecall}
            onMemorySubtract={pressMemorySubtract}
            onOperator={pressOperator}
            onPercent={pressPercent}
            onSignToggle={pressSignToggle}
          />
        </CardContent>
      </Card>
    </div>
  )
}
