import { useCallback, useEffect, useRef, useState } from 'react'

import type { CalculatorMode } from '@/lib/calculator-orchestrator'
import {
  getActiveNumber,
  getExpressionLine,
  hasStoredMemory,
  initialOrchestratorState,
  transition,
  type AngleUnit,
  type CalculatorOrchestratorAction,
  type CalculatorOrchestratorState,
} from '@/lib/calculator-orchestrator'
import type { Operator } from '@/lib/calculation'
import {
  appendEntry,
  clearHistory as clearHistoryEntries,
  getRecallResult,
  type HistoryEntry,
} from '@/lib/calculation-history'
import { loadPersistedState, isStorageDegraded, savePersistedState } from '@/lib/calculator-persistence'
import type { ImmediateUnaryName } from '@/lib/expression'

type SessionPhase = 'entry' | 'result' | 'error'

function getSessionPhase(state: CalculatorOrchestratorState): SessionPhase {
  return state.mode === 'basic' ? state.basic.phase : state.scientific.phase
}

function stripTrailingEquals(expressionLine: string): string {
  if (expressionLine.endsWith(' =')) {
    return expressionLine.slice(0, -2)
  }
  if (expressionLine.endsWith('=')) {
    return expressionLine.slice(0, -1).trimEnd()
  }
  return expressionLine
}

function shouldAppendHistory(
  prevState: CalculatorOrchestratorState,
  nextState: CalculatorOrchestratorState,
): boolean {
  const nextPhase = getSessionPhase(nextState)
  if (nextPhase === 'error' || nextPhase !== 'result') {
    return false
  }

  const prevPhase = getSessionPhase(prevState)
  if (nextState.mode === 'basic' && prevPhase === 'result') {
    return false
  }

  return true
}

function createInitialOrchestratorState(memory: number): CalculatorOrchestratorState {
  return {
    ...initialOrchestratorState,
    memory,
    basic: { ...initialOrchestratorState.basic, memory },
    scientific: { ...initialOrchestratorState.scientific, memory },
  }
}

function isMemoryMutationAction(action: CalculatorOrchestratorAction): boolean {
  return (
    action.type === 'memoryClear' ||
    action.type === 'memoryRecall' ||
    action.type === 'memoryAdd' ||
    action.type === 'memorySubtract'
  )
}

export function useCalculator() {
  const [initialPersisted] = useState(() => loadPersistedState())

  const [state, setState] = useState<CalculatorOrchestratorState>(() =>
    createInitialOrchestratorState(initialPersisted.memory),
  )

  const [history, setHistory] = useState<HistoryEntry[]>(() => initialPersisted.history)

  const [noticeDismissed, setNoticeDismissed] = useState(false)
  const [showStorageNotice, setShowStorageNotice] = useState(() => isStorageDegraded())

  const historyRef = useRef(history)

  useEffect(() => {
    historyRef.current = history
  }, [history])

  const updateStorageNotice = useCallback(() => {
    if (!noticeDismissed && isStorageDegraded()) {
      setShowStorageNotice(true)
    }
  }, [noticeDismissed])

  const persist = useCallback(
    (historyEntries: HistoryEntry[], memory: number) => {
      savePersistedState({
        version: 1,
        history: historyEntries,
        memory,
      })
      updateStorageNotice()
    },
    [updateStorageNotice],
  )

  const dismissStorageNotice = useCallback(() => {
    setNoticeDismissed(true)
    setShowStorageNotice(false)
  }, [])

  const dispatchAction = useCallback((action: CalculatorOrchestratorAction) => {
    setState((prev) => transition(prev, action))
  }, [])

  const dispatchWithPersist = useCallback(
    (action: CalculatorOrchestratorAction) => {
      setState((prev) => {
        const nextState = transition(prev, action)
        if (isMemoryMutationAction(action)) {
          persist(historyRef.current, nextState.memory)
        }
        return nextState
      })
    },
    [persist],
  )

  const pressDigit = useCallback(
    (digit: number) => {
      dispatchAction({ type: 'digit', digit })
    },
    [dispatchAction],
  )

  const pressOperator = useCallback(
    (operator: Operator) => {
      dispatchAction({ type: 'operator', operator })
    },
    [dispatchAction],
  )

  const pressEquals = useCallback(() => {
    setState((prev) => {
      const nextState = transition(prev, { type: 'equals' })
      if (shouldAppendHistory(prev, nextState)) {
        const nextHistory = appendEntry(historyRef.current, {
          expression: stripTrailingEquals(getExpressionLine(nextState)),
          result: getActiveNumber(nextState),
        })
        historyRef.current = nextHistory
        setHistory(nextHistory)
        persist(nextHistory, nextState.memory)
      }
      return nextState
    })
  }, [persist])

  const pressAllClear = useCallback(() => {
    dispatchAction({ type: 'allClear' })
  }, [dispatchAction])

  const pressClear = useCallback(() => {
    dispatchAction({ type: 'clear' })
  }, [dispatchAction])

  const pressDecimal = useCallback(() => {
    dispatchAction({ type: 'decimal' })
  }, [dispatchAction])

  const pressSignToggle = useCallback(() => {
    dispatchAction({ type: 'signToggle' })
  }, [dispatchAction])

  const pressPercent = useCallback(() => {
    dispatchAction({ type: 'percent' })
  }, [dispatchAction])

  const pressMemoryClear = useCallback(() => {
    dispatchWithPersist({ type: 'memoryClear' })
  }, [dispatchWithPersist])

  const pressMemoryRecall = useCallback(() => {
    dispatchWithPersist({ type: 'memoryRecall' })
  }, [dispatchWithPersist])

  const pressMemoryAdd = useCallback(() => {
    dispatchWithPersist({ type: 'memoryAdd' })
  }, [dispatchWithPersist])

  const pressMemorySubtract = useCallback(() => {
    dispatchWithPersist({ type: 'memorySubtract' })
  }, [dispatchWithPersist])

  const pressBackspace = useCallback(() => {
    dispatchAction({ type: 'backspace' })
  }, [dispatchAction])

  const pressOpenParen = useCallback(() => {
    dispatchAction({ type: 'openParen' })
  }, [dispatchAction])

  const pressCloseParen = useCallback(() => {
    dispatchAction({ type: 'closeParen' })
  }, [dispatchAction])

  const pressConstant = useCallback((name: 'pi' | 'e') => {
    dispatchAction({ type: 'constant', name })
  }, [dispatchAction])

  const pressPower = useCallback(() => {
    dispatchAction({ type: 'power' })
  }, [dispatchAction])

  const pressUnaryFunction = useCallback((name: ImmediateUnaryName) => {
    dispatchAction({ type: 'unaryFunction', name })
  }, [dispatchAction])

  const setMode = useCallback(
    (mode: CalculatorMode) => {
      dispatchAction({ type: 'setMode', mode })
    },
    [dispatchAction],
  )

  const setAngleUnit = useCallback(
    (angleUnit: AngleUnit) => {
      dispatchAction({ type: 'setAngleUnit', angleUnit })
    },
    [dispatchAction],
  )

  const recallHistory = useCallback(
    (entry: HistoryEntry) => {
      dispatchAction({ type: 'recallHistoryResult', result: getRecallResult(entry) })
    },
    [dispatchAction],
  )

  const clearHistory = useCallback(() => {
    const nextHistory = clearHistoryEntries()
    historyRef.current = nextHistory
    setHistory(nextHistory)
    setState((prev) => {
      persist(nextHistory, prev.memory)
      return prev
    })
  }, [persist])

  return {
    mode: state.mode,
    angleUnit: state.angleUnit,
    expressionLine: getExpressionLine(state),
    activeNumber: getActiveNumber(state),
    hasMemory: hasStoredMemory(state.memory),
    history,
    showStorageNotice,
    dismissStorageNotice,
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
    recallHistory,
    clearHistory,
  }
}
