import dynamic from "next/dynamic"
import Head from "next/head"
import { useMemo } from "react"

const MapPage = () => {
  const WorldMap = useMemo(
    () =>
      dynamic(() => import("../modules/WorldMap/WorldMap"), {
        loading: () => <p>Loading...</p>, // nosonar
        ssr: false,
      }),
    [],
  )

  return (
    <>
      <Head>
        <title>HATA World Map</title>
        <meta property="og:title" content="HATA SMP World Map" />
        <meta
          property="og:description"
          content="Interactive map with notable places on the server."
        />
      </Head>
      <section className="w-full max-h-full overflow-hidden">
        <WorldMap />
      </section>
    </>
  )
}

export default MapPage
