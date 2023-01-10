import { createTheme, PaletteMode, ThemeProvider } from "@mui/material"
import { red } from "@mui/material/colors"
import { Montserrat } from "@next/font/google"
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react"

interface IColourModeContext {
  toggleTheme: () => void
  theme: PaletteMode
}

export const ColourModeContext = createContext<IColourModeContext>({
  toggleTheme: () => {},
  theme: "dark",
})



export const font = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
})

export const ColourModeContextProvider: FunctionComponent<{
  children: ReactNode
}> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>("dark")
  const colourMode = useMemo(
    () =>
      ({
        toggleTheme: () => {
          setMode((th) => (th === "dark" ? "light" : "dark"))
        },
        theme: mode,
      } as IColourModeContext),
    [mode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#556cd6",
          },
          secondary: {
            main: "#19857b",
          },
          error: {
            main: red.A400,
          },
        },
        typography: {
          fontFamily: font.style.fontFamily,
        },
      }),
    [mode],
  )

  return (
    <ColourModeContext.Provider value={colourMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColourModeContext.Provider>
  )
}

export const useColourMode = () => useContext(ColourModeContext)
