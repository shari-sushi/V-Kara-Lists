import type { Meta, StoryObj } from "@storybook/react"
import { NotLoggedIn } from "@/components/layout/Main"
import { FailedMessage } from "@/components/Message/FailedMessage"

type DeletePagePreviewProps = {
  isSignin: boolean
  hasError: boolean
}

const DeletePagePreview = ({ isSignin, hasError }: DeletePagePreviewProps) => {
  if (!isSignin) {
    return <NotLoggedIn />
  }

  return (
    <div className="flex flex-col w-full max-w-[900px] mx-auto p-4">
      {hasError && <FailedMessage />}
      <div className="inline-block text-sm mb-4 mt-2 mx-auto">
        <h1>会員の方へ</h1>
        <li>現在、データの編集・削除はデータ登録者とサイト管理者しかできないようにロックしています。</li>
        <li>ご自身の登録データはmypageでも確認できます。</li>
      </div>
      <div className="text-center text-gray-400 py-8">
        ※ 削除ページはAPIデータに依存するため、テーブル部分はStorybook上では表示されません。
        <br />
        ログイン状態の切り替えとエラー表示の確認に使用してください。
      </div>
    </div>
  )
}

const meta: Meta<typeof DeletePagePreview> = {
  title: "Page/DeletePage",
  component: DeletePagePreview,
  tags: ["autodocs"],
  argTypes: {
    isSignin: { control: "boolean" },
    hasError: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof DeletePagePreview>

export const LoggedIn: Story = {
  args: { isSignin: true, hasError: false },
}

export const NotLoggedInView: Story = {
  args: { isSignin: false, hasError: false },
}

export const WithError: Story = {
  args: { isSignin: true, hasError: true },
}
