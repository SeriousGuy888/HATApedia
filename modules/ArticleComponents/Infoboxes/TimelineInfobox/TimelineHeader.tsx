import { NextPage } from "next"
import { Dispatch, SetStateAction } from "react"
import { getEventColours } from "./TimelineEvent"
import { TimelineEventData } from "./TimelineInfobox"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"

const TimelineHeader: NextPage<{
  selectedEvent?: TimelineEventData
  setSelectedEvent: Dispatch<
    SetStateAction<TimelineEventData | null | undefined>
  >
  selectedEventCols: ReturnType<typeof getEventColours> | null
  title?: string
}> = ({ selectedEvent, setSelectedEvent, selectedEventCols, title }) => {
  return (
    <section
      className="bg-blue-200 dark:bg-blue-900 mb-0 px-6 py-4 rounded-t-lg flex justify-between"
      style={
        selectedEvent
          ? {
              backgroundColor: selectedEventCols?.colour,
            }
          : {}
      }
    >
      <h2
        className="m-0 text-black dark:text-white font-bold"
        style={
          selectedEvent
            ? {
                color: selectedEventCols?.textCol,
              }
            : {}
        }
      >
        {selectedEvent ? selectedEvent.title : title ?? "Timeline"}
      </h2>
      {selectedEvent && (
        <button onClick={() => setSelectedEvent(null)}>
          <CloseRoundedIcon sx={{ color: selectedEventCols?.textCol }} />
        </button>
      )}
    </section>
  )
}

export default TimelineHeader