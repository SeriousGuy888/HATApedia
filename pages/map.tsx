import Head from "next/head"
import WorldMap from "../modules/WorldMap/WorldMap"

const WorldMapPage = () => {
  return (
    <>
      <Head>
        <title>Server Map</title>
      </Head>
      <section>
        <h1>Server Map</h1>
        <WorldMap />
      </section>
    </>
  )
}

export default WorldMapPage
