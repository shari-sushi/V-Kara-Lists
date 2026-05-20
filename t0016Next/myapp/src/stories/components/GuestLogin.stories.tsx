import type { Meta, StoryObj } from "@storybook/react"
import { GuestLogin } from "@/components/button/User"

const meta: Meta<typeof GuestLogin> = {
  title: "Components/GuestLogin",
  component: GuestLogin,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof GuestLogin>

export const Default: Story = {}
