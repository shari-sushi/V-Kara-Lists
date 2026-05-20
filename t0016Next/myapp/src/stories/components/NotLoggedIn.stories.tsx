import type { Meta, StoryObj } from "@storybook/react"
import { NotLoggedIn } from "@/components/layout/Main"

const meta: Meta<typeof NotLoggedIn> = {
  title: "Components/NotLoggedIn",
  component: NotLoggedIn,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof NotLoggedIn>

export const Default: Story = {}
