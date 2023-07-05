import Link from "next/link"
import Image from "next/image"
import ThemeSwitcher from "./ThemeSwitcher"
import { useEffect, useState } from "react"

const Topbar = () => {
  const [date, setDate] = useState<Date | null>(null)
  useEffect(() => {
    setDate(new Date())
  }, [])

  return (
    <nav className="flex gap-8 items-center sticky print:static top-0 z-40 bg-blue-900 py-4 px-8">
      <Logo />
      <div className="flex justify-start items-center gap-4 text-gray-200 text-sm print:hidden">
        <Link href={"/articles"}>Articles</Link>
        <Link href={"/map"}>Map</Link>
        <Link href={"/weather"}>Weather</Link>
      </div>
      <ThemeSwitcher />
      <div className="hidden print:flex justify-between w-full text-sm">
        <p>HATApedia</p>
        <p className="text-right">{date ? date.toISOString() : ""}</p>
      </div>
    </nav>
  )
}

const Logo = () => {
  return (
    <Link
      href="/"
      className="gap-2 items-center no-underline print:hidden flex"
    >
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
