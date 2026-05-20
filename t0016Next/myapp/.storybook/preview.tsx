import type { Preview, Decorator } from "@storybook/react"
import React from "react"
import { RootProvider } from "../src/providers/RootProvider"
import "../src/styles/global.css"

const withProviders: Decorator = (Story, context) => {
  const isSignin = context.globals.isSignin === true
  return (
    <RootProvider isSignin={isSignin}>
      <Story />
    </RootProvider>
  )
}

const preview: Preview = {
  globalTypes: {
    isSignin: {
      description: "ログイン状態",
      defaultValue: false,
      toolbar: {
        title: "Auth",
        icon: "user",
        items: [
          { value: false, title: "ゲスト（未ログイン）" },
          { value: true, title: "ログイン済み" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withProviders],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
  },
}

export default preview
