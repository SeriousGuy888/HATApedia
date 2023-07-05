import { NextPage } from "next"
import { useEffect, useState } from "react"
import { parse } from "yaml"

import { getEventColours } from "./TimelineEvent"

import UIElementError from "../../../_UI/UIElementError"
import TimelineEventInfo from "./TimelineEventInfo"
import TimelineHeader from "./TimelineHeader"
import TimelineField from "./TimelineField"

interface Props {
  yaml: string
}

interface TimelineData {
  title?: string
  events: TimelineEventData[]
}

export interface TimelineEventData {
  title: string
  description?: string
  lane?: number
  colour?: `#${string}`
  image?: string // wikilink to an image
  date: DateRange
}

interface DateRange {
  start: Date
  end: Date
}

export const DAY_WIDTH = 0.75 // rem
export const LANE_HEIGHT = 6 // rem
export const LANE_GAP = 0.5 // rem
export const MILLIS_PER_DAY = 1000 * 60 * 60 * 24

const TimelineInfobox: NextPage<Props> = ({ yaml }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventData | null>()
  const [selectedEventCols, setSelectedEventCols] = useState<ReturnType<
    typeof getEventColours
  > | null>(null)
  useEffect(() => {
    if (!selectedEvent) {
      return
    }

    setSelectedEventCols(getEventColours(selectedEvent))
  }, [selectedEvent])

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

  return (
    <aside className="mt-8 mb-12 not-prose">
      <TimelineHeader
        selectedEvent={selectedEvent ?? undefined}
        setSelectedEvent={setSelectedEvent}
        selectedEventCols={selectedEventCols}
        title={title}
      />
      <TimelineField
        hidden={!!selectedEvent}
        months={months}
        lanes={lanes}
        setSelectedEvent={setSelectedEvent}
      />
      {selectedEvent && <TimelineEventInfo {...selectedEvent} />}
    </aside>
  )
}

export default TimelineInfobox

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
function arrangeLanes(events: TimelineEventData[]) {
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
function getMonthsToInclude(events: TimelineEventData[]): Date[] {
  const eventDateEarliest = new Date(events[0].date.start)
  const eventDateLatest = events.reduce((soFar, curr) => {
    return curr.date.end.getTime() > soFar.getTime() ? curr.date.end : soFar
  }, eventDateEarliest)

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
export class Lane {
  occupiedRanges: DateRange[]
  events: TimelineEventData[]

  constructor() {
    this.occupiedRanges = []
    this.events = []
  }

  addEvent(event: TimelineEventData) {
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
