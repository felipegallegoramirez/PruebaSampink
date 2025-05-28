'use client'

import ProfilePage from "@/components/perfil/perfil-page"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import './globals.css'


export default function Page() {

  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('idUser')
    if (!userId) {
      router.replace('/consultar')
    }
  }, [])

  return (
    <div>
      <ProfilePage />
    </div>
  ) 
}
