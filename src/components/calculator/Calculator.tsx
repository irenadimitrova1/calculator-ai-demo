import { useCallback } from 'react'

import { Display } from '@/components/calculator/Display'
import { Keypad } from '@/components/calculator/Keypad'
import { ScientificKeypadRow } from '@/components/calculator/ScientificKeypad'
import { Card, CardContent } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useCalculator } from '@/hooks/useCalculator'
import { mapCalculatorKey } from '@/lib/map-calculator-key'

export function Calculator() {
  const {
    mode,
    angleUnit,
    expressionLine,
    activeNumber,
    hasMemory,
    setMode,
    setAngleUnit,
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
    pressOpenParen,
    pressCloseParen,
    pressConstant,
    pressPower,
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
      <Card className={mode === 'scientific' ? 'w-full max-w-md' : 'w-full max-w-xs'}>
        <CardContent className="flex flex-col gap-4">
          <ToggleGroup
            aria-label="Calculator mode"
            className="w-full"
            onValueChange={(value) => {
              if (value === 'basic' || value === 'scientific') {
                setMode(value)
              }
            }}
            spacing={0}
            type="single"
            value={mode}
            variant="outline"
          >
            <ToggleGroupItem aria-label="Basic mode" className="flex-1" value="basic">
              Basic
            </ToggleGroupItem>
            <ToggleGroupItem
              aria-label="Scientific mode"
              className="flex-1"
              value="scientific"
            >
              Scientific
            </ToggleGroupItem>
          </ToggleGroup>

          {mode === 'scientific' ? (
            <ToggleGroup
              aria-label="Angle unit"
              className="w-full"
              onValueChange={(value) => {
                if (value === 'deg' || value === 'rad') {
                  setAngleUnit(value)
                }
              }}
              spacing={0}
              type="single"
              value={angleUnit}
              variant="outline"
            >
              <ToggleGroupItem aria-label="Degrees" className="flex-1" value="deg">
                DEG
              </ToggleGroupItem>
              <ToggleGroupItem aria-label="Radians" className="flex-1" value="rad">
                RAD
              </ToggleGroupItem>
            </ToggleGroup>
          ) : null}

          <Display
            activeNumber={activeNumber}
            angleUnit={angleUnit}
            expressionLine={expressionLine}
            hasMemory={hasMemory}
            mode={mode}
          />

          {mode === 'scientific' ? (
            <ScientificKeypadRow
              onCloseParen={pressCloseParen}
              onConstant={pressConstant}
              onOpenParen={pressOpenParen}
              onPower={pressPower}
            />
          ) : null}

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
