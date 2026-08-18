import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { HistoryPanel } from '@/components/calculator/HistoryPanel'
import type { HistoryEntry } from '@/lib/calculation-history'

const TODAY = new Date('2026-08-18T14:34:00').getTime()
const YESTERDAY = new Date('2026-08-17T09:15:00').getTime()

const sampleEntries: HistoryEntry[] = [
  {
    id: 'newest',
    expression: '4 × 2',
    result: '8',
    completedAt: TODAY,
  },
  {
    id: 'older',
    expression: '2 + 3',
    result: '5',
    completedAt: YESTERDAY,
  },
]

function renderPanel(
  props: Partial<React.ComponentProps<typeof HistoryPanel>> = {},
) {
  const onRecall = vi.fn()
  const onClear = vi.fn()

  render(
    <HistoryPanel
      entries={props.entries ?? []}
      onClear={onClear}
      onRecall={onRecall}
    />,
  )

  return { onRecall, onClear }
}

describe('HistoryPanel', () => {
  it('renders empty state when history is empty', () => {
    renderPanel()

    expect(screen.getByText('No calculations yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear history' })).toBeDisabled()
  })

  it('renders rows newest-first with expression = result text', () => {
    renderPanel({ entries: sampleEntries })

    const listbox = screen.getByRole('listbox', { name: 'Calculation history' })
    const options = within(listbox).getAllByRole('option')

    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent('4 × 2 = 8')
    expect(options[1]).toHaveTextContent('2 + 3 = 5')
  })

  it('shows date groups and 24-hour timestamps', () => {
    renderPanel({ entries: sampleEntries })

    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
    expect(screen.getByText('14:34')).toBeInTheDocument()
    expect(screen.getByText('09:15')).toBeInTheDocument()
  })

  it('calls onRecall when a row is clicked', async () => {
    const user = userEvent.setup()
    const { onRecall } = renderPanel({ entries: sampleEntries })

    await user.click(screen.getByRole('option', { name: /4 × 2 = 8/ }))

    expect(onRecall).toHaveBeenCalledWith(sampleEntries[0])
  })

  it('calls onClear when Clear history is clicked', async () => {
    const user = userEvent.setup()
    const { onClear } = renderPanel({ entries: sampleEntries })

    await user.click(screen.getByRole('button', { name: 'Clear history' }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('supports keyboard navigation and Enter recall', async () => {
    const user = userEvent.setup()
    const { onRecall } = renderPanel({ entries: sampleEntries })

    const listbox = screen.getByRole('listbox', { name: 'Calculation history' })
    listbox.focus()
    expect(listbox).toHaveFocus()

    await user.keyboard('{ArrowDown}{Enter}')

    expect(onRecall).toHaveBeenCalledWith(sampleEntries[0])
  })

  it('renders legacy rows without a time suffix', () => {
    renderPanel({
      entries: [{ id: 'legacy', expression: '1 + 1', result: '2' }],
    })

    const option = screen.getByRole('option', { name: /1 \+ 1 = 2/ })
    expect(option).toHaveTextContent('1 + 1 = 2')
    expect(option).not.toHaveTextContent(':')
  })

  it('shows full expression in title tooltip', () => {
    renderPanel({
      entries: [
        {
          id: 'long',
          expression: 'very long expression that should truncate',
          result: '42',
          completedAt: TODAY,
        },
      ],
    })

    expect(
      screen.getByRole('option', {
        name: /very long expression that should truncate = 42/,
      }),
    ).toHaveAttribute(
      'title',
      'very long expression that should truncate = 42',
    )
  })
})
