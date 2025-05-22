"use client"

import { useAuth } from "./auth-context"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"
import ThemeToggle from "./theme-toggle"
import styles from "../../styles/auth.module.css"
import Image from 'next/image'
import { useState } from 'react'
import logo from '@/public/logo.png'
import LayoutClient from "@/app/LayoutClient"

export default function AuthLayout() {
  const { view, theme } = useAuth()
  const [isHidden, setIsHidden] = useState(false)

  const toggleHidden = () => {
    setIsHidden(!isHidden)
  }

  return (
    <div>
      <LayoutClient children={undefined}></LayoutClient>
      <div className={`${styles.container} ${styles[theme]}`}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{view === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}</h1>
            <p className={styles.subtitle}>
              {view === "login"
                ? "Ingresa tus credenciales para acceder a tu cuenta"
                : "Completa tus datos para comenzar"}
            </p>
          </div>
          <div className={styles.formContainer}>{view === "login" ? <LoginForm /> : <RegisterForm />}</div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

