import { Container, Typography } from "@mui/material"
import Head from "next/head"
import WorldMap from "../modules/WorldMap/WorldMap"

const WorldMapPage = () => {
  return (
    <>
      <Head>
        <title>Server Map</title>
      </Head>
      <Container>
        <Typography variant="h3" component="h1">
          Server Map
        </Typography>
        <WorldMap />
      </Container>
    </>
  )
}

export default WorldMapPage
