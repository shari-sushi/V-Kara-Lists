import React, { createContext, useContext, useState, ReactNode } from "react"

type HamburgerMenuContextType = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggleOpen: () => void
}

const HamburgerMenuContext = createContext<HamburgerMenuContextType | undefined>(undefined)

export const HamburgerMenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpenState] = useState(false)

  const setIsOpen = (val: boolean) => {
    document.documentElement.style.overflow = val ? "hidden" : ""
    setIsOpenState(val)
  }
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <HamburgerMenuContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      {children}
    </HamburgerMenuContext.Provider>
  )
}

export const useHamburgerMenu = (): HamburgerMenuContextType => {
  const context = useContext(HamburgerMenuContext)
  if (context === undefined) {
    throw new Error("useHamburgerMenu must be used within a HamburgerMenuProvider")
  }
  return context
}
