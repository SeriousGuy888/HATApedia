import Link from "next/link"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"

const Topbar = () => {
  return (
    <nav className="flex justify-between items-center sticky bg-blue-900 py-4 px-8">
      <Link href="/" style={{ textDecoration: "none" }}>
        <span className="text-white text-2xl tracking-wide font-bold">
          HATApedia
        </span>
      </Link>
      <ThemeSwitcher />
      {/* <button className="rounded-full bg-blue-600 text-white px-4 py-2">
        Toggle Theme
      </button> */}
    </nav>
  )
}

export default Topbar
