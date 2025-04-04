"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-context"
import PasswordInput from "./password-input"
import FormError from "./form-error"
import styles from "../../styles/auth.module.css"
import { getStatus } from "@/services/table"

export default function LoginForm() {
  const { switchView } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!email || !password) {
      setError("All fields are required")
      return
    }

    setIsLoading(true)

    // Mock authentication
    setTimeout(() => {
      // For demo purposes, accept any credentials with basic validation
      if (email.includes("@") && password.length >= 6) {
        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify({ email }))
        window.location.reload() // Reload to update auth state
      } else {
        setError("Invalid email or password")
      }
      setIsLoading(false)
    }, 1000)
  }

  const consultelist = () =>{
    getStatus('prueba').then((response) => {
      console.log(response)
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <FormError message={error} />}

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          className={styles.input}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button className={styles.button} onClick={consultelist}>Consulte</button>

      <div className={styles.forgotPassword}>
        <a href="#" onClick={(e) => e.preventDefault()}>
          Forgot Password?
        </a>
      </div>

      <button type="submit" className={`${styles.button} ${isLoading ? styles.loading : ""}`} disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <div className={styles.switchView}>
        Don't have an account?{" "}
        <button type="button" className={styles.switchButton} onClick={() => switchView("register")}>
          Sign Up
        </button>
      </div>
    </form>
  )
}

