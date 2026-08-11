import { Display } from '@/components/calculator/Display'
import { Keypad } from '@/components/calculator/Keypad'
import { Card, CardContent } from '@/components/ui/card'
import { useCalculator } from '@/hooks/useCalculator'

export function Calculator() {
  const { topLine, bottomLine, pressDigit, pressOperator, pressEquals } =
    useCalculator()

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-4">
        <Display bottomLine={bottomLine} topLine={topLine} />
        <Keypad
          onDigit={pressDigit}
          onEquals={pressEquals}
          onOperator={pressOperator}
        />
      </CardContent>
    </Card>
  )
}
