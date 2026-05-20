import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { EditForm } from "@/components/form/EditContentForm"
import { mockBasicData } from "../__mocks__/data"

const meta: Meta<typeof EditForm> = {
  title: "Form/EditForm",
  component: EditForm,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof EditForm>

export const Interactive: Story = {
  render: () => {
    const [selectedVtuber, setSelectedVtuber] = useState(0)
    const [selectedMovie, setSelectedMovie] = useState("")
    const [selectedKaraoke, setSelectedKaraoke] = useState(0)

    return (
      <div className="max-w-[800px] mx-auto p-4">
        <EditForm
          posts={mockBasicData}
          selectedVtuber={selectedVtuber}
          selectedMovie={selectedMovie}
          selectedKaraoke={selectedKaraoke}
          setSelectedVtuber={setSelectedVtuber}
          setSelectedMovie={setSelectedMovie}
          setSelectedKaraoke={setSelectedKaraoke}
          clearMovieHandler={() => {}}
        />
      </div>
    )
  },
}

export const VtuberSelected: Story = {
  render: () => {
    const [selectedVtuber, setSelectedVtuber] = useState(1)
    const [selectedMovie, setSelectedMovie] = useState("")
    const [selectedKaraoke, setSelectedKaraoke] = useState(0)

    return (
      <div className="max-w-[800px] mx-auto p-4">
        <EditForm
          posts={mockBasicData}
          selectedVtuber={selectedVtuber}
          selectedMovie={selectedMovie}
          selectedKaraoke={selectedKaraoke}
          setSelectedVtuber={setSelectedVtuber}
          setSelectedMovie={setSelectedMovie}
          setSelectedKaraoke={setSelectedKaraoke}
          clearMovieHandler={() => {}}
        />
      </div>
    )
  },
}

export const KaraokeTabFullySelected: Story = {
  render: () => {
    const [selectedVtuber, setSelectedVtuber] = useState(1)
    const [selectedMovie, setSelectedMovie] = useState("www.youtube.com/watch?v=9ehwhQJ50gs")
    const [selectedKaraoke, setSelectedKaraoke] = useState(1)

    return (
      <div className="max-w-[800px] mx-auto p-4">
        <EditForm
          posts={mockBasicData}
          selectedVtuber={selectedVtuber}
          selectedMovie={selectedMovie}
          selectedKaraoke={selectedKaraoke}
          setSelectedVtuber={setSelectedVtuber}
          setSelectedMovie={setSelectedMovie}
          setSelectedKaraoke={setSelectedKaraoke}
          clearMovieHandler={() => {}}
        />
      </div>
    )
  },
}
