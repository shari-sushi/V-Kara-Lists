import type { StorybookConfig } from "@storybook/react-webpack5"
import path from "path"

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      // @/* パスエイリアスを設定
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
        // next/router モック
        "next/router": require.resolve("../src/stories/__mocks__/next/router.ts"),
      }
    }
    // TypeScript / TSX のトランスパイル設定
    config.module = config.module ?? { rules: [] }
    config.module.rules = config.module.rules ?? []
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              require.resolve("@babel/preset-env"),
              [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
              require.resolve("@babel/preset-typescript"),
            ],
          },
        },
      ],
    })
    config.resolve!.extensions = [
      ...(config.resolve!.extensions ?? []),
      ".ts",
      ".tsx",
    ]
    return config
  },
}

export default config
