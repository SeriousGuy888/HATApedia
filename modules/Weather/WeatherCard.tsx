import { NextPage } from "next"
import { WeatherData } from "../../pages/weather"
import cntl from "cntl"

interface Props {
  cardInfo: {
    city: string
    country: string
  }
  weatherData: WeatherData
}

const WeatherCard: NextPage<Props> = ({ cardInfo, weatherData }) => {
  const currWeather = weatherData.current
  const temperature = Math.round(currWeather.temp_c)

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

  return (
    <article
      className={`rounded-xl w-full p-8 text-white flex flex-col gap-8 @container ${cardBg(
        {
          isDay: !!currWeather.is_day,
        },
      )}`}
    >
      <header className="flex justify-between gap-4 flex-col-reverse @md:flex-row">
        <section className="flex flex-col items-center @md:items-start">
          <h1 className="relative">
            <span className="text-7xl">{temperature}</span>
            <span className="text-xl absolute -right-6 top-2">&deg;C</span>
          </h1>
          <p className="text-xs">Feels like {currWeather.feelslike_c}&deg;C</p>
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

      <footer>
        <p className="text-right text-[0.5rem] uppercase opacity-30">
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
