"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-context"
import PasswordInput from "./password-input"
import FormError from "./form-error"
import styles from "../../styles/auth.module.css"
import { getStatus } from "@/services/table"
import { login } from "@/services/user"
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const { switchView } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!email || !password) {
      setError("All fields are required")
      return
    }

    setIsLoading(true)

    if (email.includes("@")) {
      let infor = {
        'username': email,
        'password': password,
      }
      try {
        const data = await login(infor)
        localStorage.setItem("idUser", data.user_id)
        router.push('/consultar')
      } catch (err: any) {
        console.log(err)
        if (err.response && err.response.status === 400) {
          const errorMessage = err.response.data.message ||
            "Registration failed. Please check your information and try again."
          setError(errorMessage)
        } else {
          setError("An unexpected error occurred. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      setError("Please enter a valid email")
    }
    setIsLoading(false)
  }

  const consultelist = () => {

  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <FormError message={error} />}

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          className={styles.input}
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Contraseña
        </label>
        <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div className={styles.forgotPassword}>
        <a href="#" onClick={(e) => e.preventDefault()}>
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button type="submit" className={`${styles.button} ${isLoading ? styles.loading : ""}`} disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>

      <div className={styles.switchView}>
        ¿No tienes una cuenta?{" "}
        <button type="button" className={styles.switchButton} onClick={() => switchView("register")}>
          Regístrate
        </button>
      </div>
    </form>
  )
}

