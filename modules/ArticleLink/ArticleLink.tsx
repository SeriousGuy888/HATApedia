import { NextPage } from "next"
import Link from "next/link"
import { ArticlePreview } from "../../lib/articlesApi"
import NationBanner from "./NationBanner"

const ArticleLink: NextPage<{ article: ArticlePreview }> = ({ article }) => {
  return (
    <div className="max-w-full overflow-hidden rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
      <Link className="flex justify-between" href={`./article/${article.slug}`}>
        <div className="flex-[4] overflow-x-hidden p-8 [&>*]:overflow-ellipsis [&>*]:whitespace-nowrap [&>*]:overflow-hidden">
          <h2 className="text-xl">{article.title}</h2>
          <p className="uppercase text-xs text-gray-500 dark:text-gray-400">
            {article.subtitle}
          </p>
        </div>
        <NationBanner src={article.image ?? ""} />
      </Link>
    </div>
  )
}

export default ArticleLink
