import { TimelineEvent, TimelineEventDateRange } from "../pages/timeline"
import { ArticlePreview, getAllSlugs, getArticleMetadata } from "./articlesApi"

export async function getTimelineEventsFromArticles() {
  const slugs = await getAllSlugs()
  const articles = await Promise.all(slugs.map(getArticleMetadata))

  const articlesWithTimelineInfo = articles.filter(
    (article) => article?.timeline,
  )

  const events = articlesWithTimelineInfo.map((articleMeta) => {
    const { slug, title, subtitle, image, timeline } = articleMeta!

    let date: TimelineEvent["date"]

    // check if the date is a date object, if so, use it, otherwise, check if it's a date range and use it
    if (typeof timeline?.date === "string") {
      date = timeline.date
    } else if (timeline?.date?.start && timeline?.date?.end) {
      const { start, end } = timeline.date
      date = {
        start: start.toISOString(),
        end: end.toISOString(),
      } as TimelineEventDateRange
    } else {
      throw new Error(
        `Invalid date type for article ${slug}. Expected Date or [Date, Date] (start, end), got ${typeof timeline?.date}: ${
          timeline?.date
        }. If using a start date, make sure to also specify an end date.`,
      )
    }

    return {
      article: {
        slug: slug,
        title: title,
        subtitle: subtitle,
        image: image,
      } as ArticlePreview,
      date,
    } as TimelineEvent
  })

  return events
}
