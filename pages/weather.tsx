import { GetServerSideProps, NextPage } from "next"
import useSWR from "swr"
import Head from "next/head"
import WeatherCard from "../modules/Weather/WeatherCard"
import TabbedRadio from "../modules/_UI/TabbedRadio"
import { useState } from "react"
import {
  TemperatureUnit,
  WeatherData,
} from "../modules/Weather/weatherapi_types"
import SelectDropdown from "../modules/_UI/SelectDropdown"

const Weather: NextPage<{ cities: { [id: string]: City } }> = ({ cities }) => {
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>("celsius")
  const handleUpdateTempUnit = (unitId: TemperatureUnit) => {
    setTempUnit(unitId)
  }

  const [city, setCity] = useState<string>(Object.keys(cities)[0] ?? "")
  const handleUpdateCity = (cityId: string) => {
    setCity(cityId)
  }

  let cityIdNameMap: { [id: string]: string } = {}
  Object.values(cities).forEach((city) => {
    cityIdNameMap[city.id] = `${city.name}, ${city.country}`
  })

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const fetcher = (url: string) =>
    fetch(url).then(async (res) => await res.json())
  useSWR(`/api/weather/${city}`, fetcher, {
    onSuccess: (data) => {
      setWeatherData(data)
    },
  })

  return (
    <>
      <Head>
        <title>HATA Weather</title>
        <meta property="og:title" content={"HATA Weather"} />
        <meta
          property="og:description"
          content={"Live weather updates from HATA!"}
        />
      </Head>
      <section className="my-12 w-full max-w-[90vw] lg:max-w-prose">
        <aside className="w-full flex gap-2 [&>*]:flex-grow items-stretch mb-8">
          <SelectDropdown
            options={cityIdNameMap}
            selectedOption={city}
            setSelectedOption={handleUpdateCity}
          />
          <TabbedRadio
            options={{
              celsius: "Celsius",
              kelvin: "Kelvin",
            }}
            selectedOption={tempUnit}
            setSelectedOption={handleUpdateTempUnit}
          />
        </aside>
        <WeatherCard
          cardInfo={{
            city: cities[city]?.name,
            country: cities[city]?.country,
          }}
          weatherData={weatherData}
          tempUnit={tempUnit}
        />
      </section>
    </>
  )
}

export default Weather

export const getServerSideProps: GetServerSideProps = async () => {
  const cities: {
    [id: string]: City
  } = {
    forgsville: {
      id: "forgsville",
      name: "Forgsville",
      country: "Remy Republic",
    },
    hawainot: { id: "hawainot", name: "Hawainot", country: "Remy Republic" },
    swamp_of_secrets: {
      id: "swamp_of_secrets",
      name: "Swamp of Secrets",
      country: "Tobytopia",
    },
    billzoplace: {
      id: "billzoplace",
      name: "Billzoplace",
      country: "Billzoplace City State",
    },
  }

  return {
    props: {
      cities,
    },
  }
}

interface City {
  id: string
  name: string
  country: string
}
