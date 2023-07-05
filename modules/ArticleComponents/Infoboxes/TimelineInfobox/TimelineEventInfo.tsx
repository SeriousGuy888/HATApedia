import { NextPage } from "next"
import Image from "next/image"
import { getImgWikilinkSrc } from "../../../../lib/wikilinkParser"
import { getEventDateString } from "./TimelineEvent"
import { TimelineEventData } from "./TimelineInfobox"

const TimelineEventInfo: NextPage<TimelineEventData> = (event) => {
  return (
    <section className="bg-slate-100 dark:bg-slate-800 rounded-b-lg overflow-auto w-full p-6 flex justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-sm opacity-50">{getEventDateString(event)}</p>
        <p>{event.description}</p>
      </div>
      {event.image && (
        <figure>
          <Image
            src={getImgWikilinkSrc(event.image)}
            alt={"Image of " + event.title}
            width={200}
            height={200}
            className="rounded-md"
          />
        </figure>
      )}
    </section>
  )
}

export default TimelineEventInfo