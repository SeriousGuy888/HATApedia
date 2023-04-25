import { NextPage } from "next"
import useSWR from "swr"
import { Article } from "../../lib/articlesApi"
import LinkCard from "../Search/LinkCard"
import { getImgWikilinkSrc } from "../../lib/wikilinkParser"

const ArticleLink: NextPage<{ slug?: string }> = ({ slug }) => {
  const fetcher = (url: string) =>
    fetch(url).then(async (res) => await res.json())
  const { data, error } = useSWR(`/api/article_preview/${slug}`, fetcher)
  if (error || !data?.slug) {
    return <p>Failed to get article {slug}.</p>
  }

  const article = data as Article
  const src = getImgWikilinkSrc(article.image ?? "") 

  return (
    <LinkCard
      title={article.title}
      subtitle={article.subtitle}
      link={`./article/${article.slug}`}
      imageSrc={src}
    />
  )
}

export default ArticleLink
