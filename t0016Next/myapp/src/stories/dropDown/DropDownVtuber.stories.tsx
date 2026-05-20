import type { Meta, StoryObj } from "@storybook/react"
import { DropDownVtuber } from "@/components/dropDown/Vtuber"
import { mockVtubers } from "../__mocks__/data"

const meta: Meta<typeof DropDownVtuber> = {
  title: "DropDown/DropDownVtuber",
  component: DropDownVtuber,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof DropDownVtuber>

export const Default: Story = {
  args: {
    vtubers: mockVtubers,
    onSelectVtuber: () => {},
    defaultMenuIsOpen: false,
  },
}

export const MenuOpen: Story = {
  args: {
    vtubers: mockVtubers,
    onSelectVtuber: () => {},
    defaultMenuIsOpen: true,
  },
}

export const Empty: Story = {
  args: {
    vtubers: [],
    onSelectVtuber: () => {},
    defaultMenuIsOpen: false,
  },
}
