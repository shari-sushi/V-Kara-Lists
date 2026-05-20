import type { Meta, StoryObj } from "@storybook/react"
import { NeedBox, DisableBox } from "@/components/box/Box"

const meta: Meta = {
  title: "Components/Box",
  tags: ["autodocs"],
}

export default meta

export const Need: StoryObj<typeof NeedBox> = {
  render: () => <NeedBox />,
}

export const Disable: StoryObj<typeof DisableBox> = {
  render: () => <DisableBox />,
}

export const Both: StoryObj = {
  render: () => (
    <div className="flex gap-2 items-center">
      <span>フィールド名</span>
      <NeedBox />
      <DisableBox />
    </div>
  ),
}
