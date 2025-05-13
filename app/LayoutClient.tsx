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
          <Link href="/auth" onClick={toggleHidden}>
            <div className="nav-item"><p>Login</p></div>
          </Link>
          <Link href="/form" onClick={toggleHidden}>
            <div className="nav-item"><p>Form</p></div>
          </Link>
          <Link href="/list" onClick={toggleHidden}>
            <div className="nav-item"><p>List</p></div>
          </Link>
          <Link href="/listpdf" onClick={toggleHidden}>
            <div className="nav-item"><p>ListPDF</p></div>
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
