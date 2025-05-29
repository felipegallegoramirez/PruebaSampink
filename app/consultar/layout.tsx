import ProtectedLayout from '@/components/common/ProtectedLayout'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Entity Watcher',
  description: 'Consultas en lista',
  generator: 'SamPink'
}

export default function FormLayout({
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
