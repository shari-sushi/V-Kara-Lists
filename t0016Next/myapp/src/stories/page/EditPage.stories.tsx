import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { EditForm } from "@/components/form/EditContentForm"
import { NotLoggedIn } from "@/components/layout/Main"
import { FailedMessage } from "@/components/Message/FailedMessage"
import { mockBasicData } from "../__mocks__/data"

type EditPagePreviewProps = {
  isSignin: boolean
  hasError: boolean
}

const EditPagePreview = ({ isSignin, hasError }: EditPagePreviewProps) => {
  const [selectedVtuber, setSelectedVtuber] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState("")
  const [selectedKaraoke, setSelectedKaraoke] = useState(0)

  if (!isSignin) {
    return <NotLoggedIn />
  }

  return (
    <div className="flex flex-col w-full max-w-[900px] mx-auto p-4">
      {hasError && <FailedMessage />}
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
}

const meta: Meta<typeof EditPagePreview> = {
  title: "Page/EditPage",
  component: EditPagePreview,
  tags: ["autodocs"],
  argTypes: {
    isSignin: { control: "boolean" },
    hasError: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof EditPagePreview>

export const LoggedIn: Story = {
  args: { isSignin: true, hasError: false },
}

export const NotLoggedInView: Story = {
  args: { isSignin: false, hasError: false },
}

export const WithError: Story = {
  args: { isSignin: true, hasError: true },
}
