import { NextPage } from "next"
import { TimelineEvent } from "../../pages/timeline"
import { css } from "@emotion/react"

interface Props {
  events: TimelineEvent[]
}

interface DateRange {
  start: Date
  end: Date
}

const DAY_HEIGHT = 8 // pixels
const LANE_WIDTH = 12 // rem
const LANE_GAP = 0.5 // rem
const MILLIS_PER_DAY = 1000 * 60 * 60 * 24

const Timeline: NextPage<Props> = ({ events }) => {
  const sortedEvents = events
    .map((e) => {
      return {
        ...e,
        date: {
          start: new Date(e.date.start),

          // add a day to the end date so that it's inclusive
          end: new Date(new Date(e.date.end).getTime() + MILLIS_PER_DAY),
        },
      }
    })
    .sort((a, b) => a.date.start.getTime() - b.date.start.getTime())

  const eventDateEarliest = new Date(sortedEvents[0].date.start)
  const eventDateLatest = new Date(
    sortedEvents[sortedEvents.length - 1].date.end,
  )

  const earliestYear = eventDateEarliest.getUTCFullYear()
  const earliestMonth = eventDateEarliest.getUTCMonth() // 0 indexed month -- 0-11
  const latestYear = eventDateLatest.getUTCFullYear()
  const latestMonth = eventDateLatest.getUTCMonth() // 0 indexed month -- 0-11

  const timelineDateEarliest = new Date(earliestYear, earliestMonth, 1)
  // const timelineDateLatest = new Date(latestYear, latestMonth + 1, 0)

  const months = []
  for (let i = earliestYear; i <= latestYear; i++) {
    const startMonth = i === earliestYear ? earliestMonth : 0
    const endMonth = i === latestYear ? latestMonth : 11

    for (let j = startMonth; j <= endMonth; j++) {
      months.push(new Date(i, j, 1))
    }
  }

  // create an array of lanes, where each lane keeps track of date ranges that are occupied
  let lanes: Lane[] = []

  return (
    <div className="flex gap-1">
      <section className="grid">
        {months.map((month, index) => (
          <div
            className="px-4 bg-slate-200 dark:bg-slate-800 flex flex-col justify-center border-y-[1px] border-slate-300 dark:border-slate-700 text-right"
            key={month.toISOString()}
            style={{
              height: DAY_HEIGHT * getNumDaysInMonth(month) + "px",
            }}
          >
            <h2
              className="text-lg"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              {month.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
        ))}
      </section>
      <section className="relative">
        {sortedEvents.map((e) => {
          const daysOffsetFromStart = Math.floor(
            (e.date.start.getTime() - timelineDateEarliest.getTime()) /
              MILLIS_PER_DAY,
          )

          const lengthInDays = Math.floor(
            (e.date.end.getTime() - e.date.start.getTime()) / MILLIS_PER_DAY,
          )

          const [newLanes, laneToUse] = findOpenLane(lanes, e.date)
          lanes = newLanes

          const offsetFromLeft = laneToUse * (LANE_WIDTH + LANE_GAP) + "rem"

          return (
            <div
              className={`bg-blue-500 p-2 absolute`}
              key={e.title}
              style={{
                top: daysOffsetFromStart * DAY_HEIGHT + "px",
                left: offsetFromLeft,
                height: lengthInDays * DAY_HEIGHT + "px",
                width: LANE_WIDTH + "rem",
              }}
            >
              <h2 className="text-white font-bold">{e.title}</h2>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function getNumDaysInMonth(month: Date): number {
  // Takes the month provided, goes to the next month, and then goes back a day,
  // returning the # of the last day of the month
  return new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
}

/**
 * Find the first lane that doesn't have any events that overlap with the event
 */
function findOpenLane(lanes: Lane[], dateRange: DateRange): [Lane[], number] {
  let laneToUse = 0
  let foundOpenLane = false

  while (!foundOpenLane) {
    if (lanes[laneToUse] === undefined) {
      lanes[laneToUse] = new Lane()
      foundOpenLane = true
    } else if (!lanes[laneToUse].isOccupied(dateRange)) {
      foundOpenLane = true
    } else {
      laneToUse++
    }
  }

  lanes[laneToUse].markOccupied(dateRange)
  return [lanes, laneToUse]
}

/**
  A Lane keeps track of date ranges that are occupied in that Lane
  so that events won't be placed in a Lane, but rather the next Lane
  if it would overlap with an event in that Lane.
*/
class Lane {
  occupiedRanges: DateRange[]

  constructor() {
    this.occupiedRanges = []
  }

  markOccupied(dateRange: DateRange) {
    this.occupiedRanges.push(dateRange)
    this.mergeOverlappingRanges()
  }

  isOccupied(dateRange: DateRange) {
    return this.occupiedRanges.some(
      (occupiedRange) =>
        dateRange.start.getTime() <= occupiedRange.end.getTime() &&
        dateRange.end.getTime() >= occupiedRange.start.getTime(),
    )
  }

  mergeOverlappingRanges() {
    this.occupiedRanges.sort((a, b) => a.start.getTime() - b.start.getTime())

    for (let i = 0; i < this.occupiedRanges.length - 1; i++) {
      const currentRange = this.occupiedRanges[i]
      const nextRange = this.occupiedRanges[i + 1]

      if (currentRange.end.getTime() >= nextRange.start.getTime()) {
        currentRange.end = nextRange.end
        this.occupiedRanges.splice(i + 1, 1)
        i-- // NOSONAR
      }
    }
  }
}

export default Timeline
