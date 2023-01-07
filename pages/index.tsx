import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { AppBar, Toolbar, useTheme } from "@mui/material"

export default function Home() {
  const theme = useTheme()

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h4">HATApedia</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div>
          <Container>
            <Typography
              variant="h2"
              color={theme.palette.text.primary}
              marginTop={theme.spacing(4)}
            >
              States
            </Typography>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
              gutterBottom
            >
              Empires on the server
            </Typography>
          </Container>
        </div>
      </main>
    </>
  )
}
