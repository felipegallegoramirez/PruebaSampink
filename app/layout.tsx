import type { Metadata } from 'next'
import './App.css'
import LayoutClient from './LayoutClient'
import { AuthProvider } from '@/components/login/auth-context'

export const metadata: Metadata = {
  title: 'Entity Watcher',
  description: 'Consultas en lista',
  generator: 'SamPink'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  )
}
