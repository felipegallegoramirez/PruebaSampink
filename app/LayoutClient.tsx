'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation' 
import logo from '@/public/logo.png'

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isHidden, setIsHidden] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  const pathname = usePathname() 

  useEffect(() => {
    
    if (typeof window !== 'undefined') { 
      const sessionData = localStorage.getItem('idUser'); 
      setIsLoggedIn(!!sessionData);
    }
  }, []);

  const toggleHidden = () => {
    setIsHidden(!isHidden)
  }

  const isLoginPage = pathname === '/login' 

  return (
    <div>
      {isLoginPage ? (
        
        <nav className="login-nav">
          <Image
            src={logo}
            className="logo-centered"
            alt="Logo"
            priority
          />
        </nav>
      ) : (
        
        <nav id="Central" className={`CentralNav ${isHidden ? 'Hidden' : ''}`}>
          <Image
            
            src={logo}
            className="logo"
            alt="Logo"
            priority
          />
          <div className="nav-superior">
            <Link href={isLoggedIn ? "/perfil" : "/login"} >
              <div className="nav-item">
                <p>{isLoggedIn ? "Profile" : "Iniciar Sesión"}</p>
              </div>
            </Link>
            <Link href="/consultar" >
              <div className="nav-item">
                <p>Consultar</p>
              </div>
            </Link>
            <Link href="/historico" >
              <div className="nav-item">
                <p>Histórico</p>
              </div>
            </Link>
          </div>
        </nav>
      )}
      {children}
    </div>
  )
}