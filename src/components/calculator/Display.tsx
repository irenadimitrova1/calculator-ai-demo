type DisplayProps = {
  expressionLine: string
  activeNumber: string
}

export function Display({ expressionLine, activeNumber }: DisplayProps) {
  return (
    <div
      aria-label="Calculator display"
      className="rounded-lg bg-muted/50 px-4 py-3 font-mono tabular-nums"
      role="status"
    >
      <div
        className="min-h-6 truncate text-right text-lg text-muted-foreground"
        data-testid="display-expression"
      >
        {expressionLine}
      </div>
      <div
        className="min-h-8 truncate text-right text-2xl font-semibold"
        data-testid="display-active-number"
      >
        {activeNumber}
      </div>
    </div>
  )
}
