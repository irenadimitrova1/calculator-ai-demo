import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { NOTICE_MESSAGE } from '@/components/calculator/StorageDegradeNotice'
import { resetStorageDegradedForTests } from '@/lib/calculator-persistence'

import App from './App'

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.get(key) ?? null
    },
    key(index: number) {
      return [...store.keys()][index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
  }
}

describe('App', () => {
  beforeEach(() => {
    resetStorageDegradedForTests()
    vi.stubGlobal('localStorage', createLocalStorageMock())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the calculator as the full application', () => {
    render(<App />)

    expect(
      screen.getByRole('status', { name: 'Calculator display' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'equals' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Basic mode' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Scientific mode' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Coming soon' }),
    ).not.toBeInTheDocument()
  })

  it('completes a calculation end-to-end through the UI', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))

    expect(screen.getByTestId('display-active-number')).toHaveTextContent('5')
  })

  it('clears the display with AC', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'all clear' }))

    expect(screen.getByTestId('display-active-number')).toHaveTextContent('')
    expect(screen.getByTestId('display-expression')).toHaveTextContent('')
  })

  it('clears the display with C after a finished result', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))
    await user.click(screen.getByRole('button', { name: 'clear' }))

    expect(screen.getByTestId('display-active-number')).toHaveTextContent('')
    expect(screen.getByTestId('display-expression')).toHaveTextContent('')
  })

  it('completes a calculation using keyboard input', async () => {
    const user = userEvent.setup()
    render(<App />)

    const calculator = screen.getByLabelText('Calculator')
    await user.click(calculator)
    await user.keyboard('2+3{Enter}')

    expect(screen.getByTestId('display-active-number')).toHaveTextContent('5')
  })

  it('hides and shows the entire history panel from the calculator toggle', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('History')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Hide history' }))

    expect(screen.queryByText('History')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show history' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show history' }))

    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('appends a history row after equals', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))

    const listbox = screen.getByRole('listbox', { name: 'Calculation history' })
    expect(within(listbox).getByRole('option', { name: /2 \+ 3 = 5/ })).toBeInTheDocument()
  })

  it('recalls a history entry into the active number', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))

    const listbox = screen.getByRole('listbox', { name: 'Calculation history' })
    await user.click(within(listbox).getByRole('option', { name: /2 \+ 3 = 5/ }))

    expect(screen.getByTestId('display-expression')).toHaveTextContent('')
    expect(screen.getByTestId('display-active-number')).toHaveTextContent('5')
  })

  it('restores history and memory after remount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))
    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: 'memory add' }))

    unmount()
    render(<App />)

    const listbox = screen.getByRole('listbox', { name: 'Calculation history' })
    expect(within(listbox).getByRole('option', { name: /2 \+ 3 = 5/ })).toBeInTheDocument()
    expect(screen.getByLabelText('Memory stored')).toBeInTheDocument()
  })

  it('resets mode and in-progress session on remount while restoring history and memory', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))
    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: 'memory add' }))

    await user.click(screen.getByRole('radio', { name: 'Scientific mode' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'add' }))

    unmount()
    render(<App />)

    expect(screen.getByRole('radio', { name: 'Basic mode' })).toBeChecked()
    expect(screen.getByTestId('display-expression')).toHaveTextContent('')
    expect(screen.getByTestId('display-active-number')).toHaveTextContent('')
    const listbox = screen.getByRole('listbox', { name: 'Calculation history' })
    expect(within(listbox).getByRole('option', { name: /2 \+ 3 = 5/ })).toBeInTheDocument()
    expect(screen.getByLabelText('Memory stored')).toBeInTheDocument()
  })

  it('shows a dismissible storage degrade notice and remains usable', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('storage blocked')
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    })

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))

    expect(screen.getByText(NOTICE_MESSAGE)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Dismiss notice' }))

    expect(screen.queryByText(NOTICE_MESSAGE)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))

    expect(screen.getByTestId('display-active-number')).toHaveTextContent('2')
    expect(screen.queryByText(NOTICE_MESSAGE)).not.toBeInTheDocument()
  })
})
