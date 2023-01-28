import Link from "next/link"
import { useColourMode } from "../../providers/ColourModeContext"

const Topbar = () => {
  const mode = useColourMode()

  return (
    <nav style={{ display: "flex", justifyContent: "space-between" }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <h4>HATApedia</h4>
      </Link>
      <button onClick={mode.toggle}>Toggle Theme</button>
    </nav>
  )
}

export default Topbar
