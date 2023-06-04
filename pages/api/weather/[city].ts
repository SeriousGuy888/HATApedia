import { NextApiRequest, NextApiResponse } from "next"
import { WeatherData } from "../../../modules/Weather/weatherapi_types"
import { getFakeCityRealCityMap } from "../../../lib/weatherCitiesManager"

const apiKey = process.env.WEATHER_API_COM_API_KEY

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const city = req.query.city as string
  const fakeCityToRealCity = getFakeCityRealCityMap()

  if (!fakeCityToRealCity[city]) {
    res.status(404).json({
      error: {
        code: -1,
        message: `City not found: ${city}`,
      },
    } as WeatherData)
    return
  }

  // https://www.weatherapi.com/docs/#intro-request -- city name, postal code, or latlng
  const location = fakeCityToRealCity[city]

  try {
    const weatherRes = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`,
      {
        next: {
          // https://nextjs.org/docs/app/api-reference/functions/fetch#optionsnextrevalidate
          revalidate: 15 * 60, // 15 minutes
        },
      },
    )
    const weatherData: WeatherData = await weatherRes.json()

    res.status(200).json(weatherData)
  } catch (err) {
    res.status(400).json({
      error: {
        code: -1,
        message: `Failed to make API request: ${err}`,
      },
    } as WeatherData)
  }
}
