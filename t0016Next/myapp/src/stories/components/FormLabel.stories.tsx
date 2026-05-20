import type { Meta, StoryObj } from "@storybook/react"
import { FormLabel } from "@/components/form/CreateContentForm/FormLabel"

const meta: Meta<typeof FormLabel> = {
  title: "Components/FormLabel",
  component: FormLabel,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof FormLabel>

export const Required: Story = {
  args: { label: "VTuber", need: true },
}

export const Optional: Story = {
  args: { label: "紹介動画URL", need: false },
}

export const AutoFill: Story = {
  args: { label: "動画タイトル", autoForm: true },
}
