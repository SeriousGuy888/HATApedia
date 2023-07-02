import { NextPage } from "next"
import { getTimelineEventsFromArticles } from "../lib/timelineApi"
import Head from "next/head"

interface Props {
  events: TimelineEvent[]
}

export interface TimelineEvent {
  slug: string
  date: string
  title: string
  description?: string
}

const Timeline: NextPage<Props> = ({ events }) => {
  return (
    <>
      <Head>
        <title>Timeline</title>
      </Head>
      <section className="my-12">
        <pre>{JSON.stringify(events, null, 2)}</pre>
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

export default Timeline
