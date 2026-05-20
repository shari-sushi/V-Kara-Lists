import type { Meta, StoryObj } from "@storybook/react"
import { FailedMessage } from "@/components/Message/FailedMessage"

const meta: Meta<typeof FailedMessage> = {
  title: "Components/FailedMessage",
  component: FailedMessage,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof FailedMessage>

export const Default: Story = {}
