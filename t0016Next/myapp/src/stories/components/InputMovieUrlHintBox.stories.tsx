import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { InputMovieUrlHintBox } from "@/components/form/CreateContentForm/InputMovieUrlHintBox"

const meta: Meta<typeof InputMovieUrlHintBox> = {
  title: "Components/InputMovieUrlHintBox",
  component: InputMovieUrlHintBox,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof InputMovieUrlHintBox>

export const Interactive: Story = {
  render: () => {
    const [isDisplay, setIsDisplay] = useState(false)
    return (
      <div className="p-8">
        <InputMovieUrlHintBox isDisplay={isDisplay} setIsDisplay={setIsDisplay} />
      </div>
    )
  },
}

export const Open: Story = {
  args: { isDisplay: true, setIsDisplay: () => {} },
}

export const Closed: Story = {
  args: { isDisplay: false, setIsDisplay: () => {} },
}
