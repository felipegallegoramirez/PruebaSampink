"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/components/auth/auth-context"
import AuthLayout from "@/components/auth/auth-layout"
import Dashboard from "@/components/dashboard"
import "./styles.css"

import { getLists } from "@/services/list"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user")
    if (user) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsAuthenticated(false)
  }



  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />
  }

  return (

    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  )
}

