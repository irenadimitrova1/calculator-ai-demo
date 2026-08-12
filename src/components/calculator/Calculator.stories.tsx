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
