import type { Meta, StoryObj } from "@storybook/react"
import { DropDownMovie } from "@/components/dropDown/Movie"
import { mockMovies } from "../__mocks__/data"

const meta: Meta<typeof DropDownMovie> = {
  title: "DropDown/DropDownMovie",
  component: DropDownMovie,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof DropDownMovie>

export const Enabled: Story = {
  args: {
    videos: mockMovies,
    disabled: false,
    setSelectedMovie: () => {},
    clearMovieHandler: () => {},
  },
}

export const Disabled: Story = {
  args: {
    videos: mockMovies,
    disabled: true,
    setSelectedMovie: () => {},
    clearMovieHandler: () => {},
  },
}

export const Empty: Story = {
  args: {
    videos: [],
    disabled: false,
    setSelectedMovie: () => {},
    clearMovieHandler: () => {},
  },
}
