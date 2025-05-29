import type { Metadata } from 'next'
import './globals.css'
import ProtectedLayout from '@/components/common/ProtectedLayout'

export const metadata: Metadata = {
  title: 'Entity Watcher',
  description: 'Consultas en lista',
  generator: 'SamPink'
}

export default function ListLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedLayout>
      {children}
    </ProtectedLayout>
  )
}
