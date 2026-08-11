import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calculator } from './Calculator'

const meta = {
  title: 'Calculator',
  component: Calculator,
} satisfies Meta<typeof Calculator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
