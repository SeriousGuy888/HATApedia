import { AppBar, Toolbar, Typography, Button } from "@mui/material"
import Link from "next/link"
import { useColourMode } from "../../providers/ColourModeContext"

const Topbar = () => {
  const mode = useColourMode()

  return (
    <AppBar position="sticky">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }} color="textPrimary">
          <Typography variant="h4">HATApedia</Typography>
        </Link>
        <Button variant="contained" onClick={mode.toggle}>
          Toggle Theme
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
