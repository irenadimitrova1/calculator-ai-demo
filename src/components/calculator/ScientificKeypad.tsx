import { Button } from '@/components/ui/button'

type ScientificKeypadRowProps = {
  onCloseParen: () => void
  onConstant: (name: 'pi' | 'e') => void
  onOpenParen: () => void
  onPower: () => void
}

export function ScientificKeypadRow({
  onCloseParen,
  onConstant,
  onOpenParen,
  onPower,
}: ScientificKeypadRowProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
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
      <Button
        aria-label="power"
        className="h-14 text-lg"
        onClick={onPower}
        size="lg"
        type="button"
        variant="secondary"
      >
        ^
      </Button>
    </div>
  )
}
