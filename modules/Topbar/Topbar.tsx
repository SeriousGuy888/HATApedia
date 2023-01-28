import Link from "next/link"
const Topbar = () => {
  return (
    <nav className="flex justify-between sticky">
      <Link href="/" style={{ textDecoration: "none" }}>
        <h4>HATApedia</h4>
      </Link>
    </nav>
  )
}

export default Topbar
