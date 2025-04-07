"use client"

import { useState } from "react"

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggleSection = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`collapsible-section ${isOpen ? "open" : "closed"}`}>
      <div className="collapsible-header" onClick={toggleSection}>
        <h3>{title}</h3>
        <span className="collapsible-icon">{isOpen ? "−" : "+"}</span>
      </div>
      <div className="collapsible-content">{children}</div>
    </div>
  )
}

export default CollapsibleSection

