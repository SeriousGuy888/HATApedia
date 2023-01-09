import Head from "next/head"
import { AppProps } from "next/app"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider, EmotionCache } from "@emotion/react"
import theme from "../mui/theme"
import createEmotionCache from "../mui/createEmotionCache"
import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import Link from "../common/Link"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const router = useRouter()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AppBar position="sticky">
          <Toolbar>
            <Link href="/" style={{ textDecoration: "none" }} color="textPrimary">
              <Typography variant="h4">HATApedia</Typography>
            </Link>
          </Toolbar>
        </AppBar>
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
      </ThemeProvider>
    </CacheProvider>
  )
}
