import Head from "next/head"
import { AppProps } from "next/app"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import Topbar from "../modules/Topbar/Topbar"
import { Analytics } from "@vercel/analytics/react"

import "../common/globals.scss"
import { ThemeProvider } from "next-themes"
import Search from "../modules/Search/Search"
import { useEffect, useState } from "react"

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props
  const router = useRouter()

  const [isSearchActive, setSearchActive] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setSearchActive(true)
      }
      if (e.key === "Escape") {
        setSearchActive(false)
      }
    }
    addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <>
      <ThemeProvider attribute="class">
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          {/* PWA primary color */}
          <meta name="theme-color" content="#222999" />
          <meta property="og:site_name" content="HATApedia" />
        </Head>
        <div className="grid grid-rows-[4rem_1fr] min-h-screen h-fit min-w-full">
          <Topbar />
          <Search active={isSearchActive} setActive={setSearchActive} />
          <motion.main
            key={router.route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <Component {...pageProps} />
          </motion.main>
        </div>
      </ThemeProvider>

      <Analytics />
    </>
  )
}
