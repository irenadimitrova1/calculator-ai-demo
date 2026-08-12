import { Display } from '@/components/calculator/Display'
import { Keypad } from '@/components/calculator/Keypad'
import { Card, CardContent } from '@/components/ui/card'
import { useCalculator } from '@/hooks/useCalculator'

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
  } = useCalculator()

  return (
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
  )
}
