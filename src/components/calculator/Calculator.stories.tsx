import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Calculator } from './Calculator'

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
    expect(canvas.getByTestId('display-active-number')).toHaveTextContent('Error')

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
