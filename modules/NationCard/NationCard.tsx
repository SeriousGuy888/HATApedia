import { NextPage } from "next"
import Link from "next/link"
import { ArticlePreview } from "../../lib/articlesApi"
import NationBanner from "./NationBanner"
import styles from "./NationCard.module.scss"

const NationCard: NextPage<{ article: ArticlePreview }> = ({ article }) => {
  return (
    <div className="max-w-full overflow-hidden bg-gray-100 rounded-xl hover:bg-gray-200">
      <Link className="flex justify-between" href={`./article/${article.slug}`}>
        <div className="flex-[4] overflow-x-hidden p-8">
          <h2 className={styles.nowrapText + " text-lg"}>{article.title}</h2>
          <p className={styles.nowrapText + " uppercase text-sm text-gray-500"}>
            {article.subtitle}
          </p>
        </div>
        <NationBanner src={article.image ?? ""} />
      </Link>
    </div>
  )
}

export default NationCard
