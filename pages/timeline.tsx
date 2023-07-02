import { NextPage } from "next"
import { ArticlePreview } from "../lib/articlesApi"
import { getTimelineEventsFromArticles } from "../lib/timelineApi"

interface Props {
  events: TimelineEvent[]
}

export interface TimelineEvent {
  article: ArticlePreview
  date: string | TimelineEventDateRange // these strings are dates, but Date is not serialisable
}

export interface TimelineEventDateRange {
  start: string
  end: string
}

const Timeline: NextPage<Props> = ({ events }) => {
  return (
    <section className="my-12">
      <pre>{JSON.stringify(events, null, 4)}</pre>
    </section>
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
