"use client"

import type React from "react"

import { useState } from "react"
import styles from "../../styles/auth.module.css"

interface PasswordInputProps {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PasswordInput({ id, value, onChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={styles.passwordInput}>
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        className={styles.input}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className={styles.togglePassword}
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  )
}

