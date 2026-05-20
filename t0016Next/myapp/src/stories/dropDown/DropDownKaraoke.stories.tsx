import type { Meta, StoryObj } from "@storybook/react"
import { DropDownKaraokeSongs } from "@/components/dropDown/Karaoke"
import { mockKaraokes } from "../__mocks__/data"

const meta: Meta<typeof DropDownKaraokeSongs> = {
  title: "DropDown/DropDownKaraoke",
  component: DropDownKaraokeSongs,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof DropDownKaraokeSongs>

export const WithSongs: Story = {
  args: {
    karaokeSongs: mockKaraokes,
    selectedMovie: "www.youtube.com/watch?v=9ehwhQJ50gs",
    onKaraokeSelect: () => {},
  },
}

export const NoMovieSelected: Story = {
  args: {
    karaokeSongs: mockKaraokes,
    selectedMovie: "",
    onKaraokeSelect: () => {},
  },
}

export const Empty: Story = {
  args: {
    karaokeSongs: [],
    selectedMovie: "www.youtube.com/watch?v=9ehwhQJ50gs",
    onKaraokeSelect: () => {},
  },
}
