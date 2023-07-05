import { NextPage } from "next"
import { parse } from "yaml"
import UIElementError from "../../_UI/UIElementError"
import cntl from "cntl"

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
  lane?: number
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
  const codeBlock = yaml.trim() || "[empty]"

  if (!timelineData) {
    return (
      <UIElementError
        message="Timeline infobox contains no data or invalid data."
        codeBlock={codeBlock}
      />
    )
  }

  const { title, events } = timelineData
  if (!(events instanceof Array)) {
    return (
      <UIElementError
        message="Timeline infobox contains no events."
        codeBlock={codeBlock}
      />
    )
  }

  // make sure all the events in the array are structured correctly
  for (const event of events) {
    if (!event.title || !event?.date.start || !event?.date.end) {
      return (
        <UIElementError
          message="Timeline infobox contains an event with missing data."
          codeBlock={codeBlock}
        />
      )
    }

    if (typeof event.date.start === "string") {
      event.date.start = new Date(event.date.start)
    }
    if (typeof event.date.end === "string") {
      event.date.end = new Date(event.date.end)
    }

    if (typeof event.lane !== "number") {
      event.lane = undefined
    }

    if (event.date.start.getTime() > event.date.end.getTime()) {
      return (
        <UIElementError
          message="Timeline infobox contains an event with an end date before the start date."
          codeBlock={codeBlock}
        />
      )
    }
  }
  events.sort((a, b) => a.date.start.getTime() - b.date.start.getTime())

  const months = getMonthsToInclude(events)
  const lanes = arrangeLanes(events)

  const gridLineStyles = cntl`border-slate-300 dark:border-slate-700 border-r-[1px] last:border-r-0`

  return (
    <aside className="mt-8 mb-12 not-prose">
      <section className="bg-blue-200 dark:bg-blue-900 mb-0 px-6 py-4 rounded-t-lg">
        <p className="m-0 text-black dark:text-white font-bold">
          {title ?? "Timeline"}
        </p>
      </section>
      <section className="bg-slate-100 dark:bg-slate-800 rounded-b-lg overflow-auto w-full">
        <div className="flex">
          {months.map((month, index) => (
            <div
              className={`py-2 border-b-[1px] bg-slate-200 dark:bg-slate-900 text-center flex-shrink-0 h-full ${gridLineStyles}`}
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
        <div
          className="relative"
          style={{
            height:
              Math.min(lanes.length, 4) * (LANE_HEIGHT + LANE_GAP) +
              LANE_GAP +
              "rem",
          }}
        >
          {months.map((month, index) => {
            const daysOffsetFromStart = Math.floor(
              (month.getTime() - months[0].getTime()) / MILLIS_PER_DAY,
            )

            return (
              <div
                key={month.toISOString()}
                className={`absolute top-0 bottom-0 ${gridLineStyles}`}
                style={{
                  width: DAY_WIDTH * getNumDaysInMonth(month) + "px",
                  left: DAY_WIDTH * daysOffsetFromStart + "px",
                }}
              />
            )
          })}

          {lanes.map((lane, laneIndex) =>
            lane.events.map((event) => {
              return (
                <Event
                  event={event}
                  laneToUse={laneIndex} // not event.lane because arrangeLanes() may have made adjustments
                  timelineStartMonth={months[0]}
                  key={event.title}
                />
              )
            }),
          )}
        </div>
      </section>
    </aside>
  )
}

export default TimelineInfobox

const Event: NextPage<{
  event: TimelineEvent
  laneToUse: number
  timelineStartMonth: Date
}> = ({ event, laneToUse, timelineStartMonth }) => {
  const daysOffsetFromStart = Math.floor(
    (event.date.start.getTime() - timelineStartMonth.getTime()) /
      MILLIS_PER_DAY,
  )

  const lengthInDays = Math.floor(
    (event.date.end.getTime() - event.date.start.getTime()) / MILLIS_PER_DAY +
      1, // add 1 day to compensate for inclusive end date
  )

  const laneOffset = laneToUse * (LANE_HEIGHT + LANE_GAP) + LANE_GAP + "rem"

  return (
    <div
      className="absolute rounded-lg overflow-hidden p-2 bg-blue-500 text-white"
      key={event.title}
      style={{
        top: laneOffset,
        left: DAY_WIDTH * daysOffsetFromStart + "px",
        width: DAY_WIDTH * lengthInDays + "px",
        height: LANE_HEIGHT + "rem",
      }}
    >
      <h2 className="font-bold">{event.title}</h2>
      <p className="text-xs font-mono opacity-50">
        {getIsoDate(event.date.start)} - {getIsoDate(event.date.end)}
      </p>
      <p className="text-xs">{event.description}</p>
    </div>
  )
}

/**
 * @param events The events to arrange into lanes
 * @returns An array of lanes, each containing events that do not overlap with each other.
 *
 *          If specified, the event will be placed in the specified lane if it is available.
 *          If an event does not specify a lane or its preferred lane is occupied, it will be placed in the next
 *          available lane.
 *
 *          Any empty lanes will be filtered out, ie: if events want to be in lanes 10, 20, and 40, they will
 *          instead by placed in lanes 0, 1, and 2.
 */
function arrangeLanes(events: TimelineEvent[]) {
  let lanes: Lane[] = []
  for (const event of events) {
    if (event.lane == undefined || lanes[event.lane]?.isOccupied(event.date)) {
      event.lane = findOpenLane(lanes, event.date)
    }

    if (!lanes[event.lane]) {
      lanes[event.lane] = new Lane()
    }

    lanes[event.lane].addEvent(event)
  }

  // filter out any empty lanes
  lanes = lanes.filter(Boolean)
  return lanes
}

/**
 * @param events The events to get the earliest and latest months from
 * @returns An array of months that should be included in the timeline, from the earliest month to the latest month.
 */
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

/**
 * Find the first available lane from the state of used lanes that doesn't have any events that overlap with the event.
 * If there are no available lanes, return the next lane that does not exist yet.
 *
 * Used if an event does not specify a lane to be placed in.
 */
function findOpenLane(lanes: Lane[], dateRange: DateRange): number {
  let laneToUse = 0
  let foundOpenLane = false

  while (!foundOpenLane) {
    if (
      lanes[laneToUse] === undefined || // if lane does not exist yet
      !lanes[laneToUse].isOccupied(dateRange) // if there's a free slot in the lane if it does exist
    ) {
      break
    }

    laneToUse++
  }

  return laneToUse
}

/**
 * A Lane keeps track of date ranges that are occupied in that Lane
 * so that events won't be placed in a Lane, but rather the next Lane
 * if it would overlap with an event in that Lane.
 *
 * It also keeps track of the events that are in that Lane.
 */
class Lane {
  occupiedRanges: DateRange[]
  events: TimelineEvent[]

  constructor() {
    this.occupiedRanges = []
    this.events = []
  }

  addEvent(event: TimelineEvent) {
    this.markOccupied(event.date)
    this.events.push(event)
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
