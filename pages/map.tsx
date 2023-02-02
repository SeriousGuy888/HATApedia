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
        <title>World Map</title>
      </Head>
      <section>
        <h1>World Map</h1>
        <div className="w-[90vw] h-[60vh]">
          <WorldMap />
        </div>
      </section>
    </>
  )
}

export default MapPage
