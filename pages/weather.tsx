import { GetStaticProps, NextPage } from "next"
import useSWR from "swr"
import Head from "next/head"
import WeatherCard from "../modules/Weather/WeatherCard"
import TabbedRadio from "../modules/_UI/TabbedRadio"
import { useEffect, useState } from "react"
import {
  TemperatureUnit,
  WeatherData,
} from "../modules/Weather/weatherapi_types"
import SelectDropdown from "../modules/_UI/SelectDropdown"
import { useRouter } from "next/router"
import { CityDisplayData, getClientCityList } from "../lib/weatherCitiesManager"

const Weather: NextPage<{ cities: { [id: string]: CityDisplayData } }> = ({
  cities,
}) => {
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>("celsius")
  const handleUpdateTempUnit = (unitId: TemperatureUnit) => {
    setTempUnit(unitId)
  }

  // <city selection>
  // Used for selecting the city to view.
  // - Allows user to select a city from a dropdown.
  // - Also allows user to link to a specific city using a hash fragment.
  // - Defaults to the first city in the list.

  const [city, setCity] = useState<string>(Object.keys(cities)[0] ?? "")
  const handleUpdateCity = (cityId: string) => {
    setCity(cityId)
  }

  let cityIdNameMap: { [id: string]: string } = {}
  Object.values(cities).forEach((city) => {
    cityIdNameMap[city.id] = `${city.name}, ${city.country}`
  })

  const { asPath } = useRouter()
  useEffect(() => {
    const cityId = asPath.split("#")[1] // get the city id from hash fragment
    if (cityId && cityIdNameMap[cityId]) {
      // if the city id is valid
      setCity(cityId) // set the city to the one specified in the hash fragment
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // </city selection>

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
        <aside className="w-full flex gap-2 [&>*]:flex-1 items-stretch mb-8">
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
            cityId: city,
            cityName: cities[city]?.name,
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

export const getStaticProps: GetStaticProps = async () => {
  const cities = getClientCityList()

  return {
    props: {
      cities,
    },
  }
}
