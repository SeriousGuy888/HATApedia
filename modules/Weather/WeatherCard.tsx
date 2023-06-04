import { NextPage } from "next"
import Image from "next/image"
import { useRef } from "react"
import { toPng } from "html-to-image" // https://github.com/tsayen/dom-to-image
import { saveAs } from "file-saver" // https://github.com/eligrey/FileSaver.js/
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded"
import LinkRoundedIcon from "@mui/icons-material/LinkRounded"
import {
  TemperatureUnit,
  WeatherCondition,
  WeatherData,
} from "./weatherapi_types"
const weatherConditions: {
  [code: string]: WeatherCondition
} = require("./weather_conditions.json")

// Import Montserrat manually so that the font renders properly when exported as an image
import { Montserrat } from "@next/font/google"
const font = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
})

interface Props {
  cardInfo: {
    cityId: string
    cityName: string
    country: string
  }
  weatherData: WeatherData | null
  tempUnit: TemperatureUnit
}

const WeatherCard: NextPage<Props> = ({ cardInfo, weatherData, tempUnit }) => {
  const currWeather = weatherData?.current ?? null
  const unitSymbol = tempUnit === "celsius" ? "°C" : "K"

  const cardElem = useRef<HTMLDivElement | null>(null)
  const buttonGroupRef = useRef<HTMLDivElement | null>(null)
  const exportToPng = () => {
    const elem = cardElem.current
    if (!elem) {
      return
    }

    const elemW = elem.clientWidth
    const elemH = elem.clientHeight
    const heightIsLarger = elemH > elemW
    const largerDimension = 2048

    buttonGroupRef.current!!.style.opacity = "0"
    toPng(elem, {
      // resize canvas but keep aspect ratio
      canvasWidth: heightIsLarger
        ? elemW * (largerDimension / elemH)
        : largerDimension,
      canvasHeight: heightIsLarger
        ? largerDimension
        : elemH * (largerDimension / elemW),
    })
      .then((png: any) => {
        saveAs(png, "weather.png")
        buttonGroupRef.current!!.style.opacity = ""
      })
      .catch((e) => {
        console.error(e)
        alert("Error while exporting image D:")
      })
  }

  const copyCityLink = () => {
    const url = `${window.location.origin}/weather#${cardInfo.cityId}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Copied to clipboard!")
      })
      .catch((e) => {
        console.error(e)
        alert("Error while copying to clipboard D:")
      })
  }

  const getWeatherCondition = (
    code: number,
    defaultConditionText: string,
    isDay: boolean,
  ) => {
    const conditionObj = weatherConditions[code.toString()]
    if (!conditionObj) {
      return defaultConditionText
    }

    let descriptionFromCode = conditionObj.description
    if (!isDay && conditionObj.description_night) {
      descriptionFromCode = conditionObj.description_night
    }

    return descriptionFromCode
  }

  const getWeatherImage = (code: number) => {
    const conditionObj = weatherConditions[code.toString()]
    if (!conditionObj) {
      return "clear"
    }

    return conditionObj.image
  }

  const getTemp = (tempCelsius: number) => {
    let temperature = Math.round(tempCelsius)
    switch (tempUnit) {
      case "celsius":
        return temperature
      case "kelvin":
        return temperature + 273
    }
  }

  const actualTemp = getTemp(currWeather?.temp_c ?? 0)
  const feelsLikeTemp = getTemp(currWeather?.feelslike_c ?? 0)

  if (weatherData?.error) {
    return (
      <article className="rounded-xl w-full p-8 bg-red-200 text-black">
        <h1>Error while getting weather data.</h1>
        <p>{weatherData.error.message}</p>
      </article>
    )
  }

  return (
    <article
      className={`
        rounded-xl overflow-clip
        w-full p-8 text-white
        flex flex-col gap-8
        @container ${font.className}
        
        relative
      `}
      ref={cardElem}
    >
      <div className="absolute inset-0 select-none pointer-events-none z-[-10]">
        <Image
          src={`/images/weather/${getWeatherImage(
            currWeather?.condition.code ?? 1000,
          )}.jpg`}
          fill
          alt=""
          className="absolute inset-0"
        />
        <span className="absolute inset-0 bg-blue-900 opacity-60" />
      </div>
      <header className="flex justify-between gap-4 flex-col-reverse @md:flex-row">
        <section className="flex flex-col items-center @md:items-start">
          <h1 className="relative">
            <span className="text-7xl">{actualTemp}</span>
            <span className="text-xl absolute -right-6 top-2">
              {unitSymbol}
            </span>
          </h1>
          <p className="text-xs">
            {feelsLikeTemp !== actualTemp
              ? `Feels like ${feelsLikeTemp}${unitSymbol}`
              : "\u200b"}
          </p>
        </section>
        <section className="flex-shrink text-center @md:text-right">
          <p className="text-xl @md:text-lg font-bold">
            {cardInfo.cityName ?? "Waiting..."}
          </p>
          <p className="text-sm text-blue-100 font-light">
            {cardInfo.country ?? "Please select a city."}
          </p>
        </section>
      </header>
      <section>
        <p className="text-center uppercase leading-4 text-sm tracking-wider @md:text-base">
          {currWeather
            ? getWeatherCondition(
                currWeather.condition.code,
                currWeather.condition.text,
                !!currWeather.is_day,
              )
            : "Waiting..."}
        </p>
      </section>
      {currWeather && (
        <ul className="grid gap-2 grid-cols-[repeat(auto-fit,_minmax(40%,1fr))]">
          <InfoBox title={"Humidity"} data={`${currWeather.humidity}%`} />
          <InfoBox
            title={"Wind"}
            data={`${currWeather.wind_kph}km/h, ${currWeather.wind_dir}`}
          />
          <InfoBox title={"Cloud Cover"} data={`${currWeather.cloud}%`} />
          <InfoBox
            title={"Precipitation"}
            data={`${currWeather.precip_mm}mm`}
          />
        </ul>
      )}
      <footer className="flex justify-between items-center gap-4">
        <div className="flex gap-2" ref={buttonGroupRef}>
          <button
            className="opacity-50 hover:opacity-100"
            onClick={exportToPng}
          >
            <DownloadRoundedIcon fontSize="small" />
          </button>
          <button
            className="opacity-50 hover:opacity-100"
            onClick={copyCityLink}
          >
            <LinkRoundedIcon fontSize="small" />
          </button>
        </div>
        <p className="flex-grow text-right text-[0.5rem] uppercase opacity-30">
          Data last updated:{" "}
          {currWeather ? currWeather.last_updated : "____-__-__ __:__"}
        </p>
      </footer>
    </article>
  )
}

const InfoBox: NextPage<{ title: string; data: string }> = ({
  title,
  data,
}) => {
  return (
    <li
      className={`
        bg-black bg-opacity-10
        filter backdrop-blur-xl

        rounded-md p-4 text-center break-words
        @container/infobox
      `}
    >
      <h2 className="uppercase text-xs tracking-tight text-gray-300 mb-2">
        {title}
      </h2>
      <p className="text-base @xs/infobox:text-lg leading-4">{data}</p>
    </li>
  )
}

export default WeatherCard
