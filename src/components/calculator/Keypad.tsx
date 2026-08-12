import { Button } from '@/components/ui/button'
import type { Operator } from '@/lib/calculation'

type KeypadProps = {
  onAllClear: () => void
  onClear: () => void
  onDecimal: () => void
  onDigit: (digit: number) => void
  onEquals: () => void
  onMemoryAdd: () => void
  onMemoryClear: () => void
  onMemoryRecall: () => void
  onMemorySubtract: () => void
  onOperator: (operator: Operator) => void
  onSignToggle: () => void
}

export function Keypad({
  onAllClear,
  onClear,
  onDecimal,
  onDigit,
  onEquals,
  onMemoryAdd,
  onMemoryClear,
  onMemoryRecall,
  onMemorySubtract,
  onOperator,
  onSignToggle,
}: KeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <Button
        aria-label="memory clear"
        className="h-14 text-lg"
        onClick={onMemoryClear}
        size="lg"
        type="button"
        variant="secondary"
      >
        MC
      </Button>
      <Button
        aria-label="memory recall"
        className="h-14 text-lg"
        onClick={onMemoryRecall}
        size="lg"
        type="button"
        variant="secondary"
      >
        MR
      </Button>
      <Button
        aria-label="memory add"
        className="h-14 text-lg"
        onClick={onMemoryAdd}
        size="lg"
        type="button"
        variant="secondary"
      >
        M+
      </Button>
      <Button
        aria-label="memory subtract"
        className="h-14 text-lg"
        onClick={onMemorySubtract}
        size="lg"
        type="button"
        variant="secondary"
      >
        M−
      </Button>
      <Button
        aria-label="all clear"
        className="h-14 text-lg"
        onClick={onAllClear}
        size="lg"
        type="button"
        variant="secondary"
      >
        AC
      </Button>
      <Button
        aria-label="clear"
        className="h-14 text-lg"
        onClick={onClear}
        size="lg"
        type="button"
        variant="secondary"
      >
        C
      </Button>
      <Button
        aria-label="sign toggle"
        className="h-14 text-lg"
        onClick={onSignToggle}
        size="lg"
        type="button"
        variant="secondary"
      >
        +/−
      </Button>
      <Button
        aria-label="decimal"
        className="h-14 text-lg"
        onClick={onDecimal}
        size="lg"
        type="button"
        variant="outline"
      >
        .
      </Button>
      <Button
        aria-label="7"
        className="h-14 text-lg"
        onClick={() => onDigit(7)}
        size="lg"
        type="button"
        variant="outline"
      >
        7
      </Button>
      <Button
        aria-label="8"
        className="h-14 text-lg"
        onClick={() => onDigit(8)}
        size="lg"
        type="button"
        variant="outline"
      >
        8
      </Button>
      <Button
        aria-label="9"
        className="h-14 text-lg"
        onClick={() => onDigit(9)}
        size="lg"
        type="button"
        variant="outline"
      >
        9
      </Button>
      <Button
        aria-label="divide"
        className="h-14 text-lg"
        onClick={() => onOperator('divide')}
        size="lg"
        type="button"
        variant="secondary"
      >
        ÷
      </Button>

      <Button
        aria-label="4"
        className="h-14 text-lg"
        onClick={() => onDigit(4)}
        size="lg"
        type="button"
        variant="outline"
      >
        4
      </Button>
      <Button
        aria-label="5"
        className="h-14 text-lg"
        onClick={() => onDigit(5)}
        size="lg"
        type="button"
        variant="outline"
      >
        5
      </Button>
      <Button
        aria-label="6"
        className="h-14 text-lg"
        onClick={() => onDigit(6)}
        size="lg"
        type="button"
        variant="outline"
      >
        6
      </Button>
      <Button
        aria-label="multiply"
        className="h-14 text-lg"
        onClick={() => onOperator('multiply')}
        size="lg"
        type="button"
        variant="secondary"
      >
        ×
      </Button>

      <Button
        aria-label="1"
        className="h-14 text-lg"
        onClick={() => onDigit(1)}
        size="lg"
        type="button"
        variant="outline"
      >
        1
      </Button>
      <Button
        aria-label="2"
        className="h-14 text-lg"
        onClick={() => onDigit(2)}
        size="lg"
        type="button"
        variant="outline"
      >
        2
      </Button>
      <Button
        aria-label="3"
        className="h-14 text-lg"
        onClick={() => onDigit(3)}
        size="lg"
        type="button"
        variant="outline"
      >
        3
      </Button>
      <Button
        aria-label="subtract"
        className="h-14 text-lg"
        onClick={() => onOperator('subtract')}
        size="lg"
        type="button"
        variant="secondary"
      >
        −
      </Button>

      <Button
        aria-label="0"
        className="col-span-2 h-14 text-lg"
        onClick={() => onDigit(0)}
        size="lg"
        type="button"
        variant="outline"
      >
        0
      </Button>
      <Button
        aria-label="equals"
        className="h-14 text-lg"
        onClick={onEquals}
        size="lg"
        type="button"
        variant="secondary"
      >
        =
      </Button>
      <Button
        aria-label="add"
        className="h-14 text-lg"
        onClick={() => onOperator('add')}
        size="lg"
        type="button"
        variant="secondary"
      >
        +
      </Button>
    </div>
  )
}
