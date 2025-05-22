import type { Metadata } from 'next'
import './App.css'
import LayoutClient from './LayoutClient'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
        <div className="relative max-w-2xl mx-auto mt-20 px-6 py-10 bg-white rounded-xl shadow-lg border border-[#d3d6f3] text-center">

          {/* Flecha indicadora */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#565eb4] animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-[#565eb4]">Bienvenido a Sampink</h1>

          <p className="text-gray-700 text-lg mt-4">
            Esta aplicación te permite consultar información profesional, legal y reputacional de personas en segundos.
          </p>

          <p className="text-gray-500 mt-3">
            Presioná el logo en la parte superior para comenzar a navegar.
          </p>
        </div>
      </body>
    </html>
  )
}
