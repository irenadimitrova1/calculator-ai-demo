import { useEffect, useRef } from 'react'

import type { CalculatorMode } from '@/lib/calculator-orchestrator'
import type { AngleUnit } from '@/lib/expression'

type DisplayProps = {
  mode: CalculatorMode
  angleUnit: AngleUnit
  expressionLine: string
  activeNumber: string
  hasMemory: boolean
}

export function Display({
  mode,
  angleUnit,
  expressionLine,
  activeNumber,
  hasMemory,
}: DisplayProps) {
  const expressionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode !== 'scientific' || expressionRef.current === null) {
      return
    }
    expressionRef.current.scrollLeft = expressionRef.current.scrollWidth
  }, [expressionLine, mode])

  const expressionClassName =
    mode === 'scientific'
      ? 'min-h-6 overflow-x-auto whitespace-nowrap text-right text-lg text-muted-foreground'
      : 'min-h-6 truncate text-right text-lg text-muted-foreground'

  return (
    <div
      aria-label="Calculator display"
      aria-live="polite"
      className="rounded-lg bg-muted/50 px-4 py-3 font-mono tabular-nums"
      role="status"
    >
      {hasMemory || mode === 'scientific' ? (
        <div className="mb-1 flex min-h-5 items-center justify-between text-sm font-semibold text-muted-foreground">
          {hasMemory ? (
            <span aria-label="Memory stored">M</span>
          ) : (
            <span aria-hidden="true" />
          )}
          {mode === 'scientific' ? (
            <span aria-label={`Angle unit: ${angleUnit === 'deg' ? 'degrees' : 'radians'}`}>
              {angleUnit === 'deg' ? 'DEG' : 'RAD'}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        ref={expressionRef}
        className={expressionClassName}
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
