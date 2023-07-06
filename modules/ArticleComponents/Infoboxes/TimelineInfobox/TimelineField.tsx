import cntl from "cntl"
import { NextPage } from "next"
import { Dispatch, SetStateAction } from "react"
import TimelineEvent from "./TimelineEvent"
import {
  TimelineEventData,
  DAY_WIDTH,
  LANE_HEIGHT,
  LANE_GAP,
  MILLIS_PER_DAY,
  Lane,
} from "./TimelineInfobox"

const TimelineField: NextPage<{
  hidden: boolean
  months: Date[]
  lanes: Lane[]
  setSelectedEvent: Dispatch<
    SetStateAction<TimelineEventData | null | undefined>
  >
}> = ({ hidden, months, lanes, setSelectedEvent }) => {
  const gridLineStyles = cntl`border-slate-300 dark:border-slate-700 border-r-[1px] last:border-r-0`

  return (
    <section
      className={`bg-slate-100 dark:bg-slate-800 rounded-b-lg overflow-auto w-full ${
        hidden ? "hidden" : ""
      }`}
    >
      <div className="flex">
        {months.map((month, index) => (
          <div
            className={`py-2 border-b-[1px] bg-slate-200 dark:bg-slate-900 text-center flex-shrink-0 h-full ${gridLineStyles}`}
            key={month.toISOString()}
            style={{
              width: DAY_WIDTH * getNumDaysInMonth(month) + "rem",
            }}
          >
            <h2 className="m-0 text-sm tracking-widest whitespace-nowrap font-bold">
              {month.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
        ))}
      </div>
      <div
        className="relative"
        style={{
          height:
            Math.min(lanes.length, 4) * (LANE_HEIGHT + LANE_GAP) +
            LANE_GAP +
            "rem",
        }}
      >
        <section className="absolute inset-0 flex">
          {months.map((month) => {
            const width = DAY_WIDTH * getNumDaysInMonth(month) + "rem"
            const daysOffsetFromStart = Math.floor(
              (month.getTime() - months[0].getTime()) / MILLIS_PER_DAY,
            )
            const leftOffset = DAY_WIDTH * daysOffsetFromStart + "rem"

            return (
              <div
                key={month.toISOString()}
                className={`h-full flex-shrink-0 ${gridLineStyles}`}
                style={{
                  width,
                  left: leftOffset,
                }}
              />
            )
          })}
        </section>

        {lanes.map((lane, laneIndex) =>
          lane.events.map((event, index) => {
            return (
              <TimelineEvent
                key={index} // NOSONAR
                event={event}
                laneToUse={laneIndex} // not event.lane because arrangeLanes() may have made adjustments
                timelineStartMonth={months[0]}
                onClick={() => {
                  setSelectedEvent(event)
                }}
              />
            )
          }),
        )}
      </div>
    </section>
  )
}

export default TimelineField

function getNumDaysInMonth(month: Date): number {
  // Takes the month provided, goes to the next month, and then goes back a day,
  // returning the # of the last day of the month
  return new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
}
