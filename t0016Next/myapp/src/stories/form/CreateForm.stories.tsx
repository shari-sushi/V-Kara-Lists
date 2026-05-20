import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { CreateForm } from "@/components/form/CreateContentForm/CreateContentForm"
import { mockBasicData } from "../__mocks__/data"

const meta: Meta<typeof CreateForm> = {
  title: "Form/CreateForm",
  component: CreateForm,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof CreateForm>

export const Interactive: Story = {
  render: () => {
    const [selectedVtuberId, setSelectedVtuberId] = useState(0)
    const [selectedMovieUrl, setSelectedMovieUrl] = useState("")
    const [selectedKaraokeId, setSelectedKaraokeId] = useState(0)
    const [currentVideoId, setCurrentVideoId] = useState("9ehwhQJ50gs")

    return (
      <div className="max-w-[800px] mx-auto p-4">
        <CreateForm
          posts={mockBasicData}
          selectedVtuberId={selectedVtuberId}
          selectedMovieUrl={selectedMovieUrl}
          selectedKaraokeId={selectedKaraokeId}
          selectVtuber={setSelectedVtuberId}
          selectVideo={setSelectedMovieUrl}
          selectKaraokeSong={setSelectedKaraokeId}
          clearMovieHandler={() => {}}
          setCurrentVideoId={setCurrentVideoId}
        />
      </div>
    )
  },
}

export const VtuberTab: Story = {
  render: () => {
    const [selectedVtuberId, setSelectedVtuberId] = useState(0)
    const [currentVideoId, setCurrentVideoId] = useState("")

    return (
      <div className="max-w-[800px] mx-auto p-4">
        <CreateForm
          posts={mockBasicData}
          selectedVtuberId={selectedVtuberId}
          selectedMovieUrl=""
          selectedKaraokeId={0}
          selectVtuber={setSelectedVtuberId}
          selectVideo={() => {}}
          selectKaraokeSong={() => {}}
          clearMovieHandler={() => {}}
          setCurrentVideoId={setCurrentVideoId}
        />
      </div>
    )
  },
}

export const EmptyData: Story = {
  render: () => {
    return (
      <div className="max-w-[800px] mx-auto p-4">
        <CreateForm
          posts={{ vtubers: [], vtubers_movies: [], vtubers_movies_karaokes: [] }}
          selectedVtuberId={0}
          selectedMovieUrl=""
          selectedKaraokeId={0}
          selectVtuber={() => {}}
          selectVideo={() => {}}
          selectKaraokeSong={() => {}}
          clearMovieHandler={() => {}}
          setCurrentVideoId={() => {}}
        />
      </div>
    )
  },
}
