import { NextPage } from "next"
import { TemperatureUnit, WeatherData } from "../../pages/weather"
import { useRef } from "react"
import cntl from "cntl"
import { toPng } from "html-to-image" // https://github.com/tsayen/dom-to-image
import { saveAs } from "file-saver" // https://github.com/eligrey/FileSaver.js/
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded"

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
    city: string
    country: string
  }
  weatherData: WeatherData
  tempUnit: TemperatureUnit
}

const WeatherCard: NextPage<Props> = ({ cardInfo, weatherData, tempUnit }) => {
  const currWeather = weatherData.current
  const unitSymbol = tempUnit === "celsius" ? "°C" : "K"

  const cardElem = useRef<HTMLDivElement | null>(null)
  const exportButton = useRef<HTMLButtonElement | null>(null)
  const exportToPng = () => {
    const elem = cardElem.current
    if (!elem) {
      return
    }

    const elemW = elem.clientWidth
    const elemH = elem.clientHeight
    const heightIsLarger = elemH > elemW
    const largerDimension = 2048

    exportButton.current!!.style.opacity = "0"
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
        exportButton.current!!.style.opacity = "1"
      })
      .catch((e) => {
        console.error(e)
        alert("Error while exporting image D:")
      })
  }

  const cardBg = ({ isDay }: { isDay: boolean }) => cntl`
    bg-gradient-to-br
    ${
      isDay
        ? cntl`
        from-blue-600
        to-slate-600
      `
        : cntl`
        from-slate-700
        to-gray-900
      `
    }
  `

  const getTemp = (tempCelsius: number) => {
    let temperature = Math.round(tempCelsius)
    switch (tempUnit) {
      case "celsius":
        return temperature
      case "kelvin":
        return temperature + 273
    }
  }

  return (
    <article
      className={`rounded-xl w-full p-8 text-white flex flex-col gap-8 @container ${cardBg(
        {
          isDay: !!currWeather.is_day,
        },
      )} ${font.className}`}
      ref={cardElem}
    >
      <header className="flex justify-between gap-4 flex-col-reverse @md:flex-row">
        <section className="flex flex-col items-center @md:items-start">
          <h1 className="relative">
            <span className="text-7xl">{getTemp(currWeather.temp_c)}</span>
            <span className="text-xl absolute -right-6 top-2">
              {unitSymbol}
            </span>
          </h1>
          <p className="text-xs">
            Feels like {getTemp(currWeather.feelslike_c)}
            {unitSymbol}
          </p>
        </section>
        <section className="flex-shrink text-center @md:text-right">
          <p className="text-xl @md:text-lg font-bold">{cardInfo.city}</p>
          <p className="text-sm text-blue-100 font-light">{cardInfo.country}</p>
        </section>
      </header>

      <section>
        <p className="text-center uppercase leading-4 text-sm tracking-wider @md:text-base">
          {currWeather.condition.text}
        </p>
      </section>

      <ul className="grid gap-2 grid-cols-[repeat(auto-fit,_minmax(40%,1fr))]">
        <InfoBox title={"Humidity"} data={`${currWeather.humidity}%`} />
        <InfoBox
          title={"Wind"}
          data={`${currWeather.wind_kph}km/h, ${currWeather.wind_dir}`}
        />
        <InfoBox title={"Cloud Cover"} data={`${currWeather.cloud}%`} />
        <InfoBox title={"Precipitation"} data={`${currWeather.precip_mm}mm`} />
      </ul>

      <footer className="flex justify-between items-center gap-4">
        <button
          className="opacity-50 hover:opacity-100"
          onClick={exportToPng}
          ref={exportButton}
        >
          <DownloadRoundedIcon fontSize="small" sx={{ color: "grey" }} />
        </button>
        <p className="flex-grow text-right text-[0.5rem] uppercase opacity-30">
          Data last updated: {currWeather.last_updated}
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
    <li className="bg-black bg-opacity-10 rounded-md p-4 text-center break-words @container/infobox">
      <h2 className="uppercase text-xs tracking-tight text-gray-300 mb-2">
        {title}
      </h2>
      <p className="text-base @xs/infobox:text-lg leading-4">{data}</p>
    </li>
  )
}

export default WeatherCard