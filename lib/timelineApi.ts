import { TimelineDateRange, TimelineEvent } from "../pages/timeline"
import { getAllSlugs, getArticleMetadata } from "./articlesApi"

export async function getTimelineEventsFromArticles(): Promise<
  TimelineEvent[]
> {
  const slugs = await getAllSlugs()
  const articles = await Promise.all(slugs.map(getArticleMetadata))

  const articlesWithEvents = articles.filter(
    (article) => article?.timeline?.events,
  )

  return articlesWithEvents
    .map((articleMeta) => {
      const { slug, timeline } = articleMeta!

      let events: TimelineEvent[] = []

      // check if the date is a date object, if so, use it, otherwise, check if it's a date range and use it
      if (timeline?.events instanceof Array) {
        events = timeline.events.map((e) => {
          let date: TimelineDateRange
          if (e.date instanceof Date) {
            date = {
              start: e.date.toISOString(),
              end: e.date.toISOString(),
            }
          } else if (
            e.date?.start instanceof Date &&
            e.date?.end instanceof Date
          ) {
            date = {
              start: e.date.start.toISOString(),
              end: e.date.end.toISOString(),
            }
          } else {
            throw new Error(
              `Article ${slug}'s timeline event ${e.title}'s date is not a date or date range`,
            )
          }

          return {
            ...e,
            slug,
            date,
          }
        })
      } else {
        throw new Error(`Article ${slug}'s timeline events are not an array`)
      }

      return events
    })
    .flat()
}
