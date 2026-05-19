import React, { createContext, useContext, useState, ReactNode } from "react"

type NoticeContextType = {
  isDisplay: boolean
  setIsDisplay: (isDisplay: boolean) => void
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined)

export const NoticeProvider = ({ children }: { children: ReactNode }) => {
  const [isDisplay, setIsDisplayState] = useState(false)

  const setIsDisplay = (val: boolean) => {
    document.documentElement.style.overflow = val ? "hidden" : ""
    setIsDisplayState(val)
  }

  return (
    <NoticeContext.Provider value={{ isDisplay, setIsDisplay }}>
      {children}
    </NoticeContext.Provider>
  )
}

export const useNotice = (): NoticeContextType => {
  const context = useContext(NoticeContext)
  if (context === undefined) {
    throw new Error("useNotice must be used within a NoticeProvider")
  }
  return context
}
