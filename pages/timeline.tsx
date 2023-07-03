import { NextPage } from "next"
import { getTimelineEventsFromArticles } from "../lib/timelineApi"
import Head from "next/head"
import Timeline from "../modules/Timeline/Timeline"
import BetaNotice from "../modules/_UI/BetaNotice"

interface Props {
  events: TimelineEvent[]
}

export interface TimelineEvent {
  slug: string
  date: TimelineDateRange
  title: string
  description?: string
}

// dates aren't serialisable D: so we have to use strings
export interface TimelineDateRange {
  start: string
  end: string
}

const TimelinePage: NextPage<Props> = ({ events }) => {
  return (
    <>
      <Head>
        <title>Timeline</title>
      </Head>
      <BetaNotice />
      <section className="w-full overflow-x-scroll">
        <Timeline events={events} />
      </section>
    </>
  )
}

export const getStaticProps = async () => {
  const events = await getTimelineEventsFromArticles()

  return {
    props: {
      events,
    } as Props,
  }
}

export default TimelinePage
