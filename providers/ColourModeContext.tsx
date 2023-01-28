// import { createTheme, PaletteMode, ThemeProvider } from "@mui/material"
// import { red } from "@mui/material/colors"
// import { Montserrat } from "@next/font/google"
// import {
//   createContext,
//   FunctionComponent,
//   ReactNode,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react"

// interface IColourModeContext {
//   colourMode: PaletteMode
//   toggle: () => void
// }

// export const ColourModeContext = createContext<IColourModeContext>({
//   colourMode: "dark",
//   toggle: () => {}
// })

// export const useColourMode = () => useContext(ColourModeContext)

// export const font = Montserrat({
//   weight: ["300", "400", "500", "700"],
//   subsets: ["latin"],
//   display: "swap",
//   fallback: ["Helvetica", "Arial", "sans-serif"],
// })

// export const ColourModeProvider: FunctionComponent<{
//   children: ReactNode
// }> = ({ children }) => {
//   const [colourMode, setColourMode] = useState<PaletteMode>("dark")
//   const toggle = useCallback(() => {
//     setColourMode((th) => (th === "dark" ? "light" : "dark"))
//   }, [])

//   const [contextValue, setContextValue] = useState<IColourModeContext>({
//     colourMode,
//     toggle,
//   })

//   useEffect(() => {
//     setContextValue({ colourMode, toggle })
//   }, [colourMode])

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: colourMode,
//           primary: {
//             main: "#556cd6",
//           },
//           secondary: {
//             main: "#19857b",
//           },
//           error: {
//             main: red.A400,
//           },
//         },
//         typography: {
//           fontFamily: font.style.fontFamily,
//         },
//       }),
//     [colourMode],
//   )

//   return (
//     <ColourModeContext.Provider value={contextValue}>
//       <ThemeProvider theme={theme}>{children}</ThemeProvider>
//     </ColourModeContext.Provider>
//   )
// }

export default 42