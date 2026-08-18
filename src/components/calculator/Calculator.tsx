import { useCallback, useState } from 'react'

import { Display } from '@/components/calculator/Display'
import { HistoryPanel } from '@/components/calculator/HistoryPanel'
import { Keypad } from '@/components/calculator/Keypad'
import { ScientificKeypad } from '@/components/calculator/ScientificKeypad'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useCalculator } from '@/hooks/useCalculator'
import {
  loadHistoryPanelVisible,
  saveHistoryPanelVisible,
} from '@/lib/history-panel-preference'
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
    pressUnaryFunction,
    history,
    recallHistory,
    clearHistory,
  } = useCalculator()

  const [historyPanelVisible, setHistoryPanelVisible] = useState(loadHistoryPanelVisible)

  const handleToggleHistoryPanel = useCallback(() => {
    setHistoryPanelVisible((current) => {
      const next = !current
      saveHistoryPanelVisible(next)
      return next
    })
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const action = mapCalculatorKey(event, mode)
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
        case 'openParen':
          pressOpenParen()
          break
        case 'closeParen':
          pressCloseParen()
          break
        case 'power':
          pressPower()
          break
        case 'constant':
          pressConstant(action.name)
          break
        case 'unaryFunction':
          pressUnaryFunction(action.name)
          break
        default: {
          const unreachable: never = action
          throw new Error(`Unknown key action: ${String(unreachable)}`)
        }
      }
    },
    [
      mode,
      pressAllClear,
      pressBackspace,
      pressCloseParen,
      pressConstant,
      pressDecimal,
      pressDigit,
      pressEquals,
      pressOpenParen,
      pressOperator,
      pressPower,
      pressUnaryFunction,
    ],
  )

  return (
    <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-start md:justify-center md:gap-6">
      {/* Calculator keyboard surface — v1 spec requires auto-focus and key capture on load */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- role application + tabIndex is the standard calculator widget pattern */}
      <div
        aria-label="Calculator"
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus -- v1 spec: keyboard works immediately on load
        className={`shrink-0 outline-none ${mode === 'scientific' ? 'w-[28rem]' : 'w-80'}`}
        onKeyDown={handleKeyDown}
        role="application"
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex -- focus target for keyboard input
      >
        <div className="mb-2 flex justify-end">
          <Button
            aria-label={historyPanelVisible ? 'Hide history' : 'Show history'}
            aria-pressed={historyPanelVisible}
            onClick={handleToggleHistoryPanel}
            size="sm"
            type="button"
            variant="outline"
          >
            {historyPanelVisible ? 'Hide history' : 'Show history'}
          </Button>
        </div>
        <Card className="w-full">
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
            <ScientificKeypad
              onCloseParen={pressCloseParen}
              onConstant={pressConstant}
              onOpenParen={pressOpenParen}
              onPower={pressPower}
              onUnary={pressUnaryFunction}
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

      {historyPanelVisible ? (
        <HistoryPanel
          entries={history}
          onClear={clearHistory}
          onRecall={recallHistory}
        />
      ) : null}
    </div>
  )
}
