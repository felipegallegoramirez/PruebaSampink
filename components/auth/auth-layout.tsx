"use client"

import { useAuth } from "./auth-context"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"
import ThemeToggle from "./theme-toggle"
import styles from "../../styles/auth.module.css"

export default function AuthLayout() {
  const { view, theme } = useAuth()

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{view === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p className={styles.subtitle}>
            {view === "login" ? "Enter your credentials to access your account" : "Fill in your details to get started"}
          </p>
        </div>
        <div className={styles.formContainer}>{view === "login" ? <LoginForm /> : <RegisterForm />}</div>
        <ThemeToggle />
      </div>
    </div>
  )
}

