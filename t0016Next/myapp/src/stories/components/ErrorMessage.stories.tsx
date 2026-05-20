import type { Meta, StoryObj } from "@storybook/react"
import { ErrorMessage } from "@/components/form/CreateContentForm/ErrorMessage"

const meta: Meta<typeof ErrorMessage> = {
  title: "Components/ErrorMessage",
  component: ErrorMessage,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof ErrorMessage>

export const WithError: Story = {
  args: {
    errorField: { type: "required", message: "このフィールドは必須です" } as any,
  },
}

export const NoError: Story = {
  args: { errorField: undefined },
}
