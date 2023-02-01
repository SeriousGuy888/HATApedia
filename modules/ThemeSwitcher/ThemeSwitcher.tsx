import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded"
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded"

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  return (
    <div className="text-white">
      <button
        className="hover:text-blue-200"
        aria-label="Toggle colour theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </button>
    </div>
  )
}

export default ThemeSwitcher
