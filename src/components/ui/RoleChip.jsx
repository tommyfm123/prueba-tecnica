import React from "react"
import "../../styles/RoleChip.css"

export default function RoleChip({ role }) {
    const isAdmin = role?.toLowerCase() === "admin"
    return (
        <span className={`role-chip ${isAdmin ? "admin" : "user"}`}>
            {isAdmin ? "Admin" : "Usuario"}
        </span>
    )
}
