import { NextPage } from "next"
import Link from "next/link"
import useSWR from "swr"
import { ArticlePreview } from "../../lib/articlesApi"
import Image from "next/image"
import LinkCard from "../Search/LinkCard"

const ArticleLink: NextPage<{ slug?: string }> = ({ slug }) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR(`/api/article_preview/${slug}`, fetcher)
  if (error || !data?.slug) {
    return <p>Failed to get article {slug}.</p>
  }

  const article = data as ArticlePreview

  return (
    <LinkCard
      title={article.title}
      subtitle={article.subtitle}
      link={`./article/${article.slug}`}
      imageSrc={article.image}
    />
  )
}

export default ArticleLink
