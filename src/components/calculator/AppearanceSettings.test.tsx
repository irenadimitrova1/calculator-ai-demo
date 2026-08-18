import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Calculator } from '@/components/calculator/Calculator'
import { resetStorageDegradedForTests } from '@/lib/calculator-persistence'

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

describe('appearance settings', () => {
  beforeEach(() => {
    resetStorageDegradedForTests()
    vi.stubGlobal('localStorage', createLocalStorageMock())
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: false }),
    )
    document.documentElement.classList.remove('dark')
    delete document.documentElement.dataset.skin
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.documentElement.classList.remove('dark')
    delete document.documentElement.dataset.skin
  })

  function setupUser() {
    return userEvent.setup({ delay: null, pointerEventsCheck: 0 })
  }

  it('updates document dark class when toggling color scheme', async () => {
    const user = setupUser()
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: 'Appearance settings' }))
    const darkMode = await screen.findByRole('radio', { name: 'Dark mode' })
    await user.click(darkMode)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  }, 10_000)

  it('updates document data-skin when selecting a skin', async () => {
    const user = setupUser()
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: 'Appearance settings' }))
    await user.click(await screen.findByRole('button', { name: 'Console skin' }))

    expect(document.documentElement.dataset.skin).toBe('console')
  })

  it('keeps session, history, and memory after appearance changes', async () => {
    const user = setupUser()
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))
    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: 'memory add' }))

    await user.click(screen.getByRole('button', { name: 'Appearance settings' }))
    await user.click(await screen.findByRole('radio', { name: 'Dark mode' }))
    await user.click(screen.getByRole('button', { name: 'Retro skin' }))

    expect(screen.getByTestId('display-active-number')).toHaveTextContent('7')
    const listbox = screen.getByRole('listbox', { name: 'Calculation history' })
    expect(within(listbox).getByRole('option', { name: /2 \+ 3 = 5/ })).toBeInTheDocument()
    expect(screen.getByLabelText('Memory stored')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Basic mode' })).toBeChecked()
  }, 10_000)

  it.each([
    { mode: 'Basic mode', keypadButton: 'equals' },
    { mode: 'Scientific mode', keypadButton: 'sine' },
  ])('keeps keypad visible in $mode at md width', async ({ mode, keypadButton }) => {
    const user = setupUser()
    render(
      <div className="md:flex md:w-[64rem]">
        <Calculator />
      </div>,
    )

    if (mode === 'Scientific mode') {
      await user.click(screen.getByRole('radio', { name: 'Scientific mode' }))
    }

    await user.click(screen.getByRole('button', { name: 'Appearance settings' }))
    expect(screen.getByRole('radio', { name: 'Light mode' })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: keypadButton })).toBeVisible()
  })
})
