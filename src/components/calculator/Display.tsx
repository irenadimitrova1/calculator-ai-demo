type DisplayProps = {
  expressionLine: string
  activeNumber: string
  hasMemory: boolean
}

export function Display({ expressionLine, activeNumber, hasMemory }: DisplayProps) {
  return (
    <div
      aria-label="Calculator display"
      className="relative rounded-lg bg-muted/50 px-4 py-3 font-mono tabular-nums"
      role="status"
    >
      {hasMemory ? (
        <span
          aria-label="Memory stored"
          className="absolute left-4 top-3 text-sm font-semibold text-muted-foreground"
        >
          M
        </span>
      ) : null}
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
