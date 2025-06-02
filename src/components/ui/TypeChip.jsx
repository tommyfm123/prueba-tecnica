import React from "react"
import "../../styles/TypeChip.css"

export default function TypeChip({ type }) {
    const normalized = type?.toLowerCase()
    const className = {
        casa: "home",
        trabajo: "work",
        otro: "other",
    }[normalized] || "other"

    return (
        <span className={`type-chip ${className}`}>
            {type}
        </span>
    )
}
