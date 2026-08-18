import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { HISTORY_CAP } from '@/lib/calculation-history'
import type { HistoryEntry } from '@/lib/calculation-history'
import { PERSISTED_VERSION } from '@/lib/calculator-persistence'

import { Calculator } from './Calculator'
import { withPersistedState } from './storybook-helpers'

const TODAY = new Date('2026-08-18T14:34:00').getTime()
const YESTERDAY = new Date('2026-08-17T09:15:00').getTime()

const sampleHistory: HistoryEntry[] = [
  {
    id: 'entry-5',
    expression: '10 − 4',
    result: '6',
    completedAt: TODAY,
  },
  {
    id: 'entry-4',
    expression: '4 × 2',
    result: '8',
    completedAt: TODAY,
  },
  {
    id: 'entry-3',
    expression: '9 ÷ 3',
    result: '3',
    completedAt: YESTERDAY,
  },
  {
    id: 'entry-2',
    expression: '2 + 3',
    result: '5',
    completedAt: YESTERDAY,
  },
  {
    id: 'entry-1',
    expression: '7 − 1',
    result: '6',
    completedAt: YESTERDAY,
  },
]

const atCapHistory: HistoryEntry[] = Array.from({ length: HISTORY_CAP }, (_, index) => ({
  id: `cap-${index + 1}`,
  expression: `${index + 1} + 1`,
  result: `${index + 2}`,
  completedAt: TODAY - index * 60_000,
}))

const postRecallSeed: HistoryEntry[] = [
  {
    id: 'recall-entry',
    expression: '2 + 3',
    result: '5',
    completedAt: TODAY,
  },
]

const meta = {
  title: 'Calculator',
  component: Calculator,
} satisfies Meta<typeof Calculator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Chaining: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '5' }))
    await userEvent.click(canvas.getByRole('button', { name: 'add' }))
    await userEvent.click(canvas.getByRole('button', { name: '3' }))
    await userEvent.click(canvas.getByRole('button', { name: 'multiply' }))
    await userEvent.click(canvas.getByRole('button', { name: '2' }))
    await userEvent.click(canvas.getByRole('button', { name: 'equals' }))

    expect(canvas.getByTestId('display-expression')).toHaveTextContent('5 + 3 × 2 =')
    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('16')
  },
}

export const MemoryIndicator: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '5' }))
    await userEvent.click(canvas.getByRole('button', { name: 'memory add' }))

    expect(canvas.getByLabelText('Memory stored')).toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '5' }))
    await userEvent.click(canvas.getByRole('button', { name: 'divide' }))
    await userEvent.click(canvas.getByRole('button', { name: '0' }))
    await userEvent.click(canvas.getByRole('button', { name: 'equals' }))

    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('Error')

    await userEvent.click(canvas.getByRole('button', { name: '1' }))
    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('1')
    expect(canvas.getByTestId('display-expression')).toHaveTextContent('')

    await userEvent.click(canvas.getByRole('button', { name: 'all clear' }))
    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('')
  },
}

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const calculator = canvas.getByLabelText('Calculator')

    await userEvent.click(calculator)
    await userEvent.keyboard('2+3{Enter}')

    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('5')
  },
}

export const ScientificLayout: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('radio', { name: 'Scientific mode' }))

    expect(canvas.getByRole('button', { name: 'sine' })).toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'open parenthesis' })).toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'equals' })).toBeInTheDocument()
    expect(canvas.getByLabelText('Angle unit: degrees')).toHaveTextContent('DEG')
  },
}

export const AngleUnitToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('radio', { name: 'Scientific mode' }))
    expect(canvas.getByLabelText('Angle unit: degrees')).toHaveTextContent('DEG')

    await userEvent.click(canvas.getByRole('radio', { name: 'Radians' }))
    expect(canvas.getByLabelText('Angle unit: radians')).toHaveTextContent('RAD')

    await userEvent.click(canvas.getByRole('radio', { name: 'Degrees' }))
    expect(canvas.getByLabelText('Angle unit: degrees')).toHaveTextContent('DEG')
  },
}

export const ScientificError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('radio', { name: 'Scientific mode' }))
    await userEvent.click(canvas.getByRole('button', { name: '5' }))
    await userEvent.click(canvas.getByRole('button', { name: 'divide' }))
    await userEvent.click(canvas.getByRole('button', { name: '0' }))
    await userEvent.click(canvas.getByRole('button', { name: 'equals' }))

    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('Error')

    await userEvent.click(canvas.getByRole('button', { name: '1' }))
    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('1')
    expect(canvas.getByTestId('display-expression')).toHaveTextContent('')
  },
}

export const LongExpressionScroll: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('radio', { name: 'Scientific mode' }))

    for (let i = 0; i < 12; i += 1) {
      await userEvent.click(canvas.getByRole('button', { name: '1' }))
      await userEvent.click(canvas.getByRole('button', { name: 'add' }))
      await userEvent.click(canvas.getByRole('button', { name: '2' }))
    }

    const expression = canvas.getByTestId('display-expression')
    expect(expression.className).toContain('overflow-x-auto')
    expect(expression.scrollWidth).toBeGreaterThan(expression.clientWidth)
  },
}

export const HistoryEmpty: Story = {
  decorators: [withPersistedState()],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvas.getByText('No calculations yet')).toBeInTheDocument()
  },
}

export const HistoryPopulated: Story = {
  decorators: [
    withPersistedState({
      version: PERSISTED_VERSION,
      history: sampleHistory,
      memory: 0,
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const listbox = canvas.getByRole('listbox', { name: 'Calculation history' })
    const options = within(listbox).getAllByRole('option')

    expect(options).toHaveLength(5)
    expect(options[0]).toHaveTextContent('10 − 4 = 6')
    expect(options[1]).toHaveTextContent('4 × 2 = 8')
  },
}

export const HistoryAtCap: Story = {
  decorators: [
    withPersistedState({
      version: PERSISTED_VERSION,
      history: atCapHistory,
      memory: 0,
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const listbox = canvas.getByRole('listbox', { name: 'Calculation history' })
    const options = within(listbox).getAllByRole('option')

    expect(options).toHaveLength(HISTORY_CAP)
  },
}

export const HistoryPostRecall: Story = {
  decorators: [
    withPersistedState({
      version: PERSISTED_VERSION,
      history: postRecallSeed,
      memory: 0,
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('option', { name: /2 \+ 3 = 5/ }))

    expect(canvas.getByTestId('display-expression')).toHaveTextContent('')
    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('5')
  },
}
