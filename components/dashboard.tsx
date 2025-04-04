"use client"

import styles from "@/styles/dashboard.module.css"

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <button className={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.welcomeCard}>
          <h2>Welcome, {user.fullName || user.email}</h2>
          <p>You have successfully logged in to your account.</p>
        </div>
      </div>
    </div>
  )
}

