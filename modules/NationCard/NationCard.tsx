import { NextPage } from "next"
import Link from "next/link"
import { ArticlePreview } from "../../lib/articlesApi"
import NationBanner from "./NationBanner"
import styles from "./NationCard.module.scss"

const NationCard: NextPage<{ article: ArticlePreview }> = ({ article }) => {
  return (
    <div>
      <Link
        style={{ display: "flex", gap: 1, justifyContent: "space-between" }}
        href={`./article/${article.slug}`}
      >
        <div
          style={{
            flex: "4",
            padding: "2rem",
            maxWidth: "80%",
          }}
        >
          <h5 className={styles.nowrapText}>{article.title}</h5>
          <p className={styles.nowrapText}>{article.subtitle}</p>
        </div>
        <NationBanner src={article.image ?? ""} />
      </Link>
    </div>
  )
}

export default NationCard
