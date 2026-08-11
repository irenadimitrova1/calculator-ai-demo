import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the calculator as the full application', () => {
    render(<App />)

    expect(
      screen.getByRole('status', { name: 'Calculator display' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'equals' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Coming soon' }),
    ).not.toBeInTheDocument()
  })

  it('shows the current operand on the top display line while typing', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))

    expect(screen.getByTestId('display-top')).toHaveTextContent('12')
    expect(screen.getByTestId('display-bottom')).toHaveTextContent('')
  })

  it('completes operand → operator → operand → equals and shows the result', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))

    expect(screen.getByTestId('display-top')).toHaveTextContent('3')

    await user.click(screen.getByRole('button', { name: 'equals' }))

    expect(screen.getByTestId('display-bottom')).toHaveTextContent('5')
  })

  it('chains the result as the starting operand for the next calculation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))

    expect(screen.getByTestId('display-bottom')).toHaveTextContent('9')
  })

  it('shows Infinity when dividing by zero without crashing', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'divide' }))
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))

    expect(screen.getByTestId('display-bottom')).toHaveTextContent('Infinity')
  })
})
