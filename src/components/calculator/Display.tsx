type DisplayProps = {
  topLine: string
  bottomLine: string
}

export function Display({ topLine, bottomLine }: DisplayProps) {
  return (
    <div
      aria-label="Calculator display"
      className="rounded-lg bg-muted/50 px-4 py-3 font-mono tabular-nums"
      role="status"
    >
      <div
        className="min-h-8 truncate text-right text-2xl font-semibold"
        data-testid="display-top"
      >
        {topLine}
      </div>
      <div
        className="min-h-6 truncate text-right text-lg text-muted-foreground"
        data-testid="display-bottom"
      >
        {bottomLine}
      </div>
    </div>
  )
}
