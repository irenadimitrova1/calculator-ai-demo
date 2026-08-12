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

  it('completes a calculation end-to-end through the UI', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: 'equals' }))

    expect(screen.getByTestId('display-bottom')).toHaveTextContent('5')
  })
})
