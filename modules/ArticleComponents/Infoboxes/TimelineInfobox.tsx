import { NextPage } from "next"
import { parse } from "yaml"
import UIElementError from "../../_UI/UIElementError"

interface Props {
  yaml: string
}

interface TimelineData {
  title?: string
  events: TimelineEvent[]
}

interface TimelineEvent {
  title: string
  description?: string
  date: DateRange
}

interface DateRange {
  start: Date
  end: Date
}

const DAY_WIDTH = 8 // pixels
const LANE_HEIGHT = 8 // rem
const LANE_GAP = 0.5 // rem
const MILLIS_PER_DAY = 1000 * 60 * 60 * 24

const TimelineInfobox: NextPage<Props> = ({ yaml }) => {
  const timelineData = parse(yaml) as TimelineData | null

  if (!timelineData) {
    return (
      <UIElementError
        message="Timeline infobox contains no data or invalid data."
        codeBlock={yaml.trim() || "[empty]"}
      />
    )
  }

  const { title, events } = timelineData
  if (!(events instanceof Array)) {
    return (
      <UIElementError
        message="Timeline infobox contains no events."
        codeBlock={yaml.trim() || "[empty]"}
      />
    )
  }

  // make sure all the events in the array are structured correctly
  for (const event of events) {
    if (!event.title || !event?.date.start || !event?.date.end) {
      return (
        <UIElementError
          message="Timeline infobox contains an event with missing data."
          codeBlock={yaml.trim() || "[empty]"}
        />
      )
    }

    if (typeof event.date.start === "string") {
      event.date.start = new Date(event.date.start)
    }
    if (typeof event.date.end === "string") {
      event.date.end = new Date(event.date.end)
    }

    if (event.date.start.getTime() > event.date.end.getTime()) {
      return (
        <UIElementError
          message="Timeline infobox contains an event with an end date before the start date."
          codeBlock={yaml.trim() || "[empty]"}
        />
      )
    }
  }
  events.sort((a, b) => a.date.start.getTime() - b.date.start.getTime())

  const months = getMonthsToInclude(events)
  let lanes: Lane[] = []

  return (
    <aside className="mt-8 mb-12 not-prose">
      <section className="bg-blue-200 dark:bg-blue-900 mb-0 px-6 py-4 rounded-t-lg">
        <p className="m-0 text-black dark:text-white font-bold">
          {title ?? "Timeline"}
        </p>
      </section>
      <section className="bg-slate-100 dark:bg-slate-800 rounded-b-lg overflow-x-scroll overflow-y-clip w-full">
        <div className="flex">
          {months.map((month, index) => (
            <div
              className="py-2 border-b-[1px] border-r-[1px] last:border-r-0 bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-center flex-shrink-0 h-full"
              key={month.toISOString()}
              style={{
                width: DAY_WIDTH * getNumDaysInMonth(month) + "px",
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
        <div className="min-h-[20rem] relative">
          {months.map((month, index) => {
            const daysOffsetFromStart = Math.floor(
              (month.getTime() - months[0].getTime()) / MILLIS_PER_DAY,
            )

            return (
              <div
                key={month.toISOString()}
                className="absolute top-0 bottom-0 border-slate-300 dark:border-slate-700 border-r-[1px] last:border-r-0"
                style={{
                  width: DAY_WIDTH * getNumDaysInMonth(month) + "px",
                  left: DAY_WIDTH * daysOffsetFromStart + "px",
                }}
              />
            )
          })}
          {events.map((e) => {
            const daysOffsetFromStart = Math.floor(
              (e.date.start.getTime() - months[0].getTime()) / MILLIS_PER_DAY,
            )

            const lengthInDays = Math.floor(
              (e.date.end.getTime() - e.date.start.getTime()) / MILLIS_PER_DAY +
                1, // add 1 day to compensate for inclusive end date
            )

            const [newLanes, laneToUse] = findOpenLane(lanes, e.date)
            lanes = newLanes

            const laneOffset =
              laneToUse * (LANE_HEIGHT + LANE_GAP) + LANE_GAP + "rem"

            return (
              <div
                className="absolute rounded-lg overflow-hidden bg-blue-500 p-2"
                key={e.title}
                style={{
                  top: laneOffset,
                  left: DAY_WIDTH * daysOffsetFromStart + "px",
                  width: DAY_WIDTH * lengthInDays + "px",
                  height: LANE_HEIGHT + "rem",
                }}
              >
                <h2 className="text-white font-bold">{e.title}</h2>
                <p className="text-xs font-mono">
                  {getIsoDate(e.date.start)} - {getIsoDate(e.date.end)}
                </p>
                <p>{e.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </aside>
  )
}

function getMonthsToInclude(events: TimelineEvent[]): Date[] {
  const eventDateEarliest = new Date(events[0].date.start)
  const eventDateLatest = new Date(events[events.length - 1].date.end)

  const earliestYear = eventDateEarliest.getUTCFullYear()
  const earliestMonth = eventDateEarliest.getUTCMonth() // 0 indexed month -- 0-11
  const latestYear = eventDateLatest.getUTCFullYear()
  const latestMonth = eventDateLatest.getUTCMonth() // 0 indexed month -- 0-11

  const months = []
  for (let i = earliestYear; i <= latestYear; i++) {
    const startMonth = i === earliestYear ? earliestMonth : 0
    const endMonth = i === latestYear ? latestMonth : 11

    for (let j = startMonth; j <= endMonth; j++) {
      months.push(new Date(i, j, 1))
    }
  }

  return months
}

function getNumDaysInMonth(month: Date): number {
  // Takes the month provided, goes to the next month, and then goes back a day,
  // returning the # of the last day of the month
  return new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
}

function getIsoDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export default TimelineInfobox

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
