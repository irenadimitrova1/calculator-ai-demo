import { Button } from '@/components/ui/button'
import type { ImmediateUnaryName } from '@/lib/expression'

type ScientificKeypadProps = {
  onCloseParen: () => void
  onConstant: (name: 'pi' | 'e') => void
  onOpenParen: () => void
  onPower: () => void
  onUnary: (name: ImmediateUnaryName) => void
}

function UnaryButton({
  ariaLabel,
  label,
  name,
  onUnary,
}: {
  ariaLabel: string
  label: string
  name: ImmediateUnaryName
  onUnary: (name: ImmediateUnaryName) => void
}) {
  return (
    <Button
      aria-label={ariaLabel}
      className="h-14 text-lg"
      onClick={() => onUnary(name)}
      size="lg"
      type="button"
      variant="secondary"
    >
      {label}
    </Button>
  )
}

export function ScientificKeypad({
  onCloseParen,
  onConstant,
  onOpenParen,
  onPower,
  onUnary,
}: ScientificKeypadProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-2">
        <UnaryButton ariaLabel="sine" label="sin" name="sin" onUnary={onUnary} />
        <UnaryButton ariaLabel="cosine" label="cos" name="cos" onUnary={onUnary} />
        <UnaryButton ariaLabel="tangent" label="tan" name="tan" onUnary={onUnary} />
        <UnaryButton ariaLabel="natural log" label="ln" name="ln" onUnary={onUnary} />
        <UnaryButton ariaLabel="log base 10" label="log" name="log" onUnary={onUnary} />
      </div>

      <div className="grid grid-cols-5 gap-2">
        <UnaryButton ariaLabel="inverse sine" label="sin⁻¹" name="asin" onUnary={onUnary} />
        <UnaryButton ariaLabel="inverse cosine" label="cos⁻¹" name="acos" onUnary={onUnary} />
        <UnaryButton ariaLabel="inverse tangent" label="tan⁻¹" name="atan" onUnary={onUnary} />
        <UnaryButton ariaLabel="square root" label="√" name="sqrt" onUnary={onUnary} />
        <UnaryButton ariaLabel="square" label="x²" name="square" onUnary={onUnary} />
      </div>

      <div className="grid grid-cols-6 gap-2">
        <UnaryButton ariaLabel="reciprocal" label="1/x" name="reciprocal" onUnary={onUnary} />
        <Button
          aria-label="x to the power y"
          className="h-14 text-lg"
          onClick={onPower}
          size="lg"
          type="button"
          variant="secondary"
        >
          x^y
        </Button>
        <Button
          aria-label="open parenthesis"
          className="h-14 text-lg"
          onClick={onOpenParen}
          size="lg"
          type="button"
          variant="secondary"
        >
          (
        </Button>
        <Button
          aria-label="close parenthesis"
          className="h-14 text-lg"
          onClick={onCloseParen}
          size="lg"
          type="button"
          variant="secondary"
        >
          )
        </Button>
        <Button
          aria-label="pi"
          className="h-14 text-lg"
          onClick={() => onConstant('pi')}
          size="lg"
          type="button"
          variant="secondary"
        >
          π
        </Button>
        <Button
          aria-label="e"
          className="h-14 text-lg"
          onClick={() => onConstant('e')}
          size="lg"
          type="button"
          variant="secondary"
        >
          e
        </Button>
      </div>
    </div>
  )
}
