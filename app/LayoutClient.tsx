'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/logo.png'

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isHidden, setIsHidden] = useState(false)

  const toggleHidden = () => {
    const user = localStorage.getItem('idUser')
    if (!user) return

    setIsHidden(!isHidden)
  }

  return (
    <div>
      <Image
        onClick={toggleHidden}
        src={logo}
        className="logo"
        alt="Logo"
        priority
      />
      <nav id="Central" className={`CentralNav ${isHidden ? 'Hidden' : ''}`}>
        <Image
          onClick={toggleHidden}
          src={logo}
          className="logo"
          alt="Logo"
        />
        <div className="nav-superior">
          <Link href="/consultar" onClick={toggleHidden}>
            <div className="nav-item"><p>Consultar</p></div>
          </Link>
          <Link href="/historico" onClick={toggleHidden}>
            <div className="nav-item"><p>Histórico</p></div>
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
