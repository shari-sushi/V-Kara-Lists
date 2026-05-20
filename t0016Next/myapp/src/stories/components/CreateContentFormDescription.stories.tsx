import type { Meta, StoryObj } from "@storybook/react"
import { CreateContentFormDescription } from "@/features/description"

const meta: Meta<typeof CreateContentFormDescription> = {
  title: "Components/CreateContentFormDescription",
  component: CreateContentFormDescription,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof CreateContentFormDescription>

export const Default: Story = {}
