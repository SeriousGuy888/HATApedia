import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import WeatherCard from "../modules/Weather/WeatherCard"

const Weather: NextPage<Props> = ({ weatherData }) => {
  return (
    <>
      <Head>
        <title>HATA Weather</title>
      </Head>
      <section className="my-12 w-full max-w-[90vw] lg:max-w-prose">
        
        <WeatherCard
          cardInfo={{ city: "Forgsville", country: "Remy Republic" }}
          weatherData={weatherData}
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

export interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    lat: number
    lon: number
    tz_id: string
    localtime_epoch: number
    localtime: string
  }
  current: {
    last_updated_epoch: number
    last_updated: string
    temp_c: number
    temp_f: number
    is_day: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_mph: number
    wind_kph: number
    wind_degree: number
    wind_dir: string
    pressure_mb: number
    pressure_in: number
    precip_mm: number
    precip_in: number
    humidity: number
    cloud: number
    feelslike_c: number
    feelslike_f: number
    vis_km: number
    vis_miles: number
    uv: number
    gust_mph: number
    gust_kph: number
  }
  error?: {
    code: number
    message: string
  }
}
