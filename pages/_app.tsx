import Head from "next/head"
import { AppProps } from "next/app"
import { useTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider, EmotionCache } from "@emotion/react"
import createEmotionCache from "../mui/createEmotionCache"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import Link from "../common/Link"
import {
  ColourModeProvider,
  useColourMode,
} from "../providers/ColourModeContext"
import { useCallback } from "react"
import Topbar from "../modules/Topbar/Topbar"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const router = useRouter()
  const theme = useTheme()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <ColourModeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Topbar />
        <motion.main
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Box marginTop={theme.spacing(4)}>
            <Component {...pageProps} />
          </Box>
        </motion.main>
      </ColourModeProvider>
    </CacheProvider>
  )
}
