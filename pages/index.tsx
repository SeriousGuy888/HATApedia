import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import {
  AppBar,
  Grid,
  Toolbar,
  useTheme,
} from "@mui/material"
import NationCard from "../modules/NationCard/NationCard"

const data = [
  {
    name: "Billzoplace City State",
    government: "Unitary One-Party Republic",
    id: "billzoplace",
  },
  {
    name: "Remy Republic",
    government: "Federal Parliamentary Republic",
    id: "remy_republic",
  },
  {
    name: "Tobytopia",
    government: "Unitary Absolute Monarchy",
    id: "tobytopia",
  },
]

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
        <Container>
          <Typography
            variant="h2"
            color={theme.palette.text.primary}
            marginTop={theme.spacing(4)}
          >
            Political Entities
          </Typography>
          <Typography
            variant="subtitle1"
            color={theme.palette.text.secondary}
            gutterBottom
          >
            States and empires on the server
          </Typography>

          <Grid marginY={4} container spacing={2}>
            {data.map((nation) => (
              <NationCard key={nation.id} nation={nation} />
            ))}
          </Grid>
        </Container>
      </main>
    </>
  )
}
