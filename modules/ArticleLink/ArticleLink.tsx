import { NextPage } from "next"
import Link from "next/link"
import useSWR from "swr"
import { ArticlePreview } from "../../lib/articlesApi"
import Image from "next/image"

const ArticleLink: NextPage<{ slug?: string }> = ({ slug }) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR(`/api/article_preview/${slug}`, fetcher)
  if (error || !data?.slug) {
    return <p>Failed to get article {slug}.</p>
  }

  const article = data as ArticlePreview

  return (
    <div className="max-w-full overflow-hidden rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" title={article.title}>
      <Link
        className="flex gap-4 justify-between px-8 py-4"
        href={`./article/${article.slug}`}
      >
        <div className="flex-[4] overflow-x-hidden py-4 [&>*]:overflow-ellipsis [&>*]:overflow-hidden">
          <h2 className="text-xl whitespace-nowrap">{article.title}</h2>
          <p className="uppercase text-xs text-gray-500 dark:text-gray-400">
            {article.subtitle}
          </p>
        </div>
        {article.image && (
          <div className="relative flex flex-[2] bg-slate-200 dark:bg-slate-700 rounded-md min-h-[8rem]">
            <Image
              src={article.image}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        )}
      </Link>
    </div>
  )
}

export default ArticleLink
