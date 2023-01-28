import Link from "next/link"

const Topbar = () => {
  return (
    <nav className="flex justify-between sticky bg-blue-900 py-4 px-8">
      <Link href="/" style={{ textDecoration: "none" }}>
        <span className="text-white text-2xl tracking-wide font-bold">
          HATApedia
        </span>
      </Link>
    </nav>
  )
}

export default Topbar
