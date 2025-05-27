'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('idUser')
    if (userId) {
      router.replace('/consultar')
    }
  }, [])

  return (
    <div>
      {children}
    </div>
  )
}
