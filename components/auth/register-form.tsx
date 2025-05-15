"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-context"
import PasswordInput from "./password-input"
import FormError from "./form-error"
import styles from "../../styles/auth.module.css"
import { register } from "@/services/user"
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const { switchView } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)


    if (email.includes("@")) {
      let infor = {
        'fullName':fullName,
        'username':email,
        'password':password,
      }
      try {
        const data = await register(infor)
        localStorage.setItem("idUser", data.id)
        const router = useRouter()
        router.push('/list')
      } catch (err: any) {
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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <FormError message={error} />}

      <div className={styles.formGroup}>
        <label htmlFor="fullName" className={styles.label}>
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          className={styles.input}
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

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

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button type="submit" className={`${styles.button} ${isLoading ? styles.loading : ""}`} disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      <div className={styles.switchView}>
        Already have an account?{" "}
        <button type="button" className={styles.switchButton} onClick={() => switchView("login")}>
          Sign In
        </button>
      </div>
    </form>
  )
}

