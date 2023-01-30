import Link from "next/link"
import Image from "next/image"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"

const Topbar = () => {
  return (
    <nav className="flex justify-between items-center sticky bg-blue-900 py-4 px-8">
      <Link href="/" className="flex gap-2 items-center no-underline">
        <Image
          src="/images/earth_icon.png"
          alt="Logo"
          width={32}
          height={32}
          style={{
            imageRendering: "pixelated",
          }}
        ></Image>
        <span className="text-white text-2xl tracking-wide font-bold">
          HATApedia
        </span>
      </Link>
      <ThemeSwitcher />
    </nav>
  )
}

export default Topbar
