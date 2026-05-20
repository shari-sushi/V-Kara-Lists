import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { CreateForm } from "@/components/form/CreateContentForm/CreateContentForm"
import { NotLoggedIn } from "@/components/layout/Main"
import { CreateContentFormDescription } from "@/features/description"
import { FailedMessage } from "@/components/Message/FailedMessage"
import { mockBasicData } from "../__mocks__/data"

type CreatePagePreviewProps = {
  isSignin: boolean
  hasError: boolean
}

const CreatePagePreview = ({ isSignin, hasError }: CreatePagePreviewProps) => {
  const [selectedVtuberId, setSelectedVtuberId] = useState(0)
  const [selectedMovieUrl, setSelectedMovieUrl] = useState("")
  const [selectedKaraokeId, setSelectedKaraokeId] = useState(0)

  if (!isSignin) {
    return <NotLoggedIn />
  }

  return (
    <div className="flex flex-col w-full max-w-[900px] mx-auto p-4">
      {hasError && <FailedMessage />}
      <CreateContentFormDescription />
      <CreateForm
        posts={mockBasicData}
        selectedVtuberId={selectedVtuberId}
        selectedMovieUrl={selectedMovieUrl}
        selectedKaraokeId={selectedKaraokeId}
        selectVtuber={setSelectedVtuberId}
        selectVideo={setSelectedMovieUrl}
        selectKaraokeSong={setSelectedKaraokeId}
        clearMovieHandler={() => {}}
        setCurrentVideoId={() => {}}
      />
    </div>
  )
}

const meta: Meta<typeof CreatePagePreview> = {
  title: "Page/CreatePage",
  component: CreatePagePreview,
  tags: ["autodocs"],
  argTypes: {
    isSignin: { control: "boolean" },
    hasError: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof CreatePagePreview>

export const LoggedIn: Story = {
  args: { isSignin: true, hasError: false },
}

export const NotLoggedInView: Story = {
  args: { isSignin: false, hasError: false },
}

export const WithError: Story = {
  args: { isSignin: true, hasError: true },
}
