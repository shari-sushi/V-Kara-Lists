import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { CrudContentSelector } from "@/components/form/util/CrudContetntSelector"
import type { CrudContentType } from "@/types/vtuber_content"

const meta: Meta<typeof CrudContentSelector> = {
  title: "Form/CrudContentSelector",
  component: CrudContentSelector,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof CrudContentSelector>

export const Interactive: Story = {
  render: () => {
    const [contentType, setContentType] = useState<CrudContentType>("movie")
    return <CrudContentSelector contentType={contentType} setContentType={setContentType} />
  },
}

export const VtuberSelected: Story = {
  args: {
    contentType: "vtuber",
    setContentType: () => {},
  },
}

export const MovieSelected: Story = {
  args: {
    contentType: "movie",
    setContentType: () => {},
  },
}

export const KaraokeSelected: Story = {
  args: {
    contentType: "karaoke",
    setContentType: () => {},
  },
}
