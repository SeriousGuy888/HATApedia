import Link from "next/link"
import Image from "next/image"
import ThemeSwitcher from "./ThemeSwitcher"

const Topbar = () => {
  return (
    <nav className="flex gap-8 items-center sticky bg-blue-900 py-4 px-8">
      <Logo />
      <div className="flex justify-start items-center gap-4 text-gray-200 text-sm">
        <Link href={"/"}>Articles</Link>
        <Link href={"/map"}>World Map</Link>
      </div>
      <ThemeSwitcher />
    </nav>
  )
}

const Logo = () => {
  return (
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
      <span className="text-white text-2xl tracking-wide font-bold hidden md:block">
        HATApedia
      </span>
    </Link>
  )
}

export default Topbar
