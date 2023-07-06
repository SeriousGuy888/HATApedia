import { NextPage } from "next"
import Image from "next/image"
import { getImgWikilinkSrc } from "../../../../lib/wikilinkParser"
import {
  DAY_WIDTH,
  LANE_GAP,
  LANE_HEIGHT,
  MILLIS_PER_DAY,
  TimelineEventData,
} from "./TimelineInfobox"
import styles from "./TimelineInfobox.module.scss"

const Event: NextPage<{
  event: TimelineEventData
  laneToUse: number
  timelineStartMonth: Date
  onClick?: () => void
}> = ({ event, laneToUse, timelineStartMonth, onClick }) => {
  const daysOffsetFromStart = Math.floor(
    (event.date.start.getTime() - timelineStartMonth.getTime()) /
      MILLIS_PER_DAY,
  )

  const lengthInDays = Math.floor(
    (event.date.end.getTime() - event.date.start.getTime()) / MILLIS_PER_DAY +
      1, // add 1 day to compensate for inclusive end date
  )

  const laneOffset = laneToUse * (LANE_HEIGHT + LANE_GAP) + LANE_GAP + "rem"

  const { colour, textCol } = getEventColours(event)

  return (
    <article
      key={event.title}
      className={`absolute rounded-lg overflow-clip text-white bg-teal-700 cursor-pointer bg-cover bg-center bg-no-repeat group/event ${
        lengthInDays <= 10 ? styles.shortEvent : ""
      }`}
      style={{
        top: laneOffset,
        left: DAY_WIDTH * daysOffsetFromStart + "rem",
        width: DAY_WIDTH * lengthInDays + "rem",
        height: LANE_HEIGHT + "rem",
        color: textCol,
        backgroundColor: colour,
      }}
      onClick={onClick}
    >
      <section className="relative w-full h-full p-2 isolate">
        {event.image && (
          <figure className="absolute inset-0 -z-30">
            <Image
              src={getImgWikilinkSrc(event.image)}
              alt=""
              fill
              className="object-cover object-center"
            />
          </figure>
        )}
        <div
          className="absolute inset-0 -z-20 opacity-90 group-hover/event:opacity-100 transition-all duration-300"
          style={{
            background: `linear-gradient(to bottom, ${colour} 40%, transparent 100%)`,
          }}
        />

        <h2 className="font-bold text-sm whitespace-nowrap overflow-ellipsis overflow-clip sticky left-0">
          {event.title}
        </h2>
        <p className="text-xs font-mono opacity-50 whitespace-nowrap">
          {getEventDateString(event)}
        </p>
      </section>
    </article>
  )
}

export default Event

function getTextCol(colour?: `#${string}`) {
  if (!colour) {
    return "white"
  }

  let hex = colour.replace("#", "")
  const is3DigitHex = hex.length === 3

  if (is3DigitHex) {
    // convert 3 digit hex to 6 digit hex
    const r = hex.substring(0, 1)
    const g = hex.substring(1, 2)
    const b = hex.substring(2, 3)
    hex = r + r + g + g + b + b
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // https://stackoverflow.com/a/3943023
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "black" : "white"
}

export function getEventColours(event: TimelineEventData) {
  const colour = event.colour ?? "#0f766e"
  const textCol = getTextCol(colour)

  return { colour, textCol }
}

function getIsoDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function getEventDateString(event: TimelineEventData): string {
  return event.date.start.getTime() === event.date.end.getTime()
    ? getIsoDate(event.date.start)
    : `${getIsoDate(event.date.start)} - ${getIsoDate(event.date.end)}`
}
