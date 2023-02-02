import Head from "next/head"
import { AppProps } from "next/app"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import Topbar from "../modules/Topbar/Topbar"

import "../common/globals.scss"
import { ThemeProvider } from "next-themes"

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props
  const router = useRouter()

  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {/* PWA primary color */}
        <meta name="theme-color" content="#222999" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <motion.main
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-1 justify-center"
        >
          <Component {...pageProps} />
        </motion.main>
      </div>
    </ThemeProvider>
  )
}
