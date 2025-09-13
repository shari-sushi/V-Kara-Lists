import { Layout } from "@/components/layout/Layout"
import { TestLink } from "./multi"

// for template
const pageName = "test/upload"
const pageNum = 0

export const App = () => {
  return (
    <Layout pageName={pageName} isSignin={false}>
      <TestLink thisPageNum={pageNum} />
      <div className="my-2 bg-blue-600 h-96 w-40 p-1 ">
        <button className="bg-blue-900 disabled:bg-gray-900" disabled>
          ボタン
        </button>
      </div>
    </Layout>
  )
}

export default App
