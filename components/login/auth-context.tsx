"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

type AuthView = "login" | "register"

interface AuthContextType {
  view: AuthView
  switchView: (view: AuthView) => void
  theme: "light" | "dark"
  toggleTheme: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthView>("login")
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const switchView = (newView: AuthView) => {
    setView(newView)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return <AuthContext.Provider value={{ view, switchView, theme, toggleTheme }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

