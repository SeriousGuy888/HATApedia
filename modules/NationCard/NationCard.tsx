import { NextPage } from "next"
import Link from "next/link"
import { ArticlePreview } from "../../lib/articlesApi"
import NationBanner from "./NationBanner"
import styles from "./NationCard.module.scss"

const NationCard: NextPage<{ article: ArticlePreview }> = ({ article }) => {
  return (
    <div className="flex-1 bg-gray-100 rounded-xl hover:bg-gray-200">
      <Link
        className="flex gap-1 justify-between"
        href={`./article/${article.slug}`}
      >
        <div className="flex-[4] p-8 max-w-[80%]">
          <h2 className={styles.nowrapText + " text-lg"}>{article.title}</h2>
          <p className={styles.nowrapText + " uppercase text-sm text-gray-500"}>{article.subtitle}</p>
        </div>
        <NationBanner src={article.image ?? ""} />
      </Link>
    </div>
  )
}

export default NationCard
