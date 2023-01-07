import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import {
  AppBar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Toolbar,
  useTheme,
} from "@mui/material"

const data = [
  {
    name: "Billzoplace",
    type: "City State",
    id: "billzoplace",
  },
  {
    name: "Remy Republic",
    type: "Federal Republic",
    id: "remy_republic",
  },
  {
    name: "Remy Republic",
    type: "Federal Republic",
    id: "tobytopia",
  },
  {
    name: "Remy Republic",
    type: "Federal Republic",
    id: "aaa",
  },
  {
    name: "Remy Republic",
    type: "Federal Republic",
    id: "bbb",
  },
  {
    name: "Remy Republic",
    type: "Federal Republic",
    id: "ccc",
  },
  {
    name: "Remy Republic",
    type: "Federal Republic",
    id: "ddd",
  },
  {
    name: "Remy Republic",
    type: "Federal Republic",
    id: "eee",
  },
  {
    name: "Remy Republic",
    type: "Federal Republic",
    id: "fff",
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
              <Grid item key={nation.id} xs={12} sm={6}>
                <Card variant="outlined">
                  <CardActionArea
                    sx={{ display: "flex", justifyContent: "space-between" }}
                    href={`./${nation.id}`}
                  >
                    <CardContent sx={{ flex: "4" }}>
                      <Typography variant="h5">{nation.name}</Typography>
                      <Typography
                        variant="caption"
                        color={theme.palette.text.secondary}
                      >
                        {nation.type}
                      </Typography>
                    </CardContent>
                    <CardMedia
                      component="img"
                      sx={{
                        flex: "1",
                        borderRadius: 1,
                        imageRendering: "pixelated",
                      }}
                      image="/images/banners/billzoplace.png"
                      alt="Banner"
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  )
}
