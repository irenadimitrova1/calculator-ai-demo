import type { Decorator } from '@storybook/react'

import {
  DEFAULT_PERSISTED_STATE,
  STORAGE_KEY,
  type PersistedStateV1,
} from '@/lib/calculator-persistence'

export function withPersistedState(state: PersistedStateV1 = DEFAULT_PERSISTED_STATE): Decorator {
  return (Story) => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return <Story />
  }
}
