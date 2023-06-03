import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import WeatherCard from "../modules/Weather/WeatherCard"
import TabbedRadio from "../modules/_UI/TabbedRadio"
import { useState } from "react"
import { TemperatureUnit, WeatherData } from "../modules/Weather/weatherapi_types"

const Weather: NextPage<Props> = ({ weatherData }) => {
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>("celsius")
  const handleUpdateTempUnit = (unitId: TemperatureUnit) => {
    setTempUnit(unitId)
  }

  return (
    <>
      <Head>
        <title>HATA Weather</title>
        <meta property="og:title" content={"HATA Weather"} />
        <meta property="og:description" content={"Live weather updates from HATA!"} />
      </Head>
      <section className="my-12 w-full max-w-[90vw] lg:max-w-prose">
        <TabbedRadio
          options={{
            celsius: "Celsius",
            kelvin: "Kelvin",
          }}
          selectedOption={tempUnit}
          setSelectedOption={handleUpdateTempUnit}
        />
        <WeatherCard
          cardInfo={{ city: "Forgsville", country: "Remy Republic" }}
          weatherData={weatherData}
          tempUnit={tempUnit}
        />
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  // don't make multiple requests within 15min
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${15 * 60}, stale-while-revalidate=${20 * 60}`,
  )

  const apiKey = process.env.WEATHER_API_COM_API_KEY
  const location = "Toronto" // https://www.weatherapi.com/docs/#intro-request -- city name, postal code, or latlng

  try {
    const weatherRes = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`,
    )
    const weatherData: WeatherData = await weatherRes.json()

    // Pass data to the page via props
    return { props: { weatherData } }
  } catch (err) {
    return {
      props: {
        weatherData: {
          error: {
            code: -1,
            message: `Failed to make API request: ${err}`,
          },
        } as WeatherData,
      },
    }
  }
}

export default Weather

interface Props {
  weatherData: WeatherData
}

