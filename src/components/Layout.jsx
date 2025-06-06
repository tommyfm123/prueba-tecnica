
import Navbar from "./Navbar"
import "../styles/Layout.css"

export default function Layout({ children }) {
    return (
        <div className="layout">
            <Navbar />
            <main className="main">{children}</main>
        </div>
    )
}
