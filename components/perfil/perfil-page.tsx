"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, CreditCard, LogOut } from "lucide-react"
import { porfile } from "@/services/user"


interface UserData {
  username: string
  credits: string
}

// Mock service to fetch user data
const fetchUserData = async (): Promise<UserData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const id = localStorage.getItem('idUser');
  if (id) {
    const data = await porfile(id);
    return data;
  } else {
    throw new Error("User ID not found.");
  }
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserData()
        setUserData(data)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("idUser")
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{userData?.name}</p>
                </div>
              </div> */}

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData?.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Credits</p>
                  <p className="font-medium">{userData?.credits}</p>
                </div>
              </div>
            </div>

            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
