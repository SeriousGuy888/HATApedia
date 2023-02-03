import ArticleLink from "../modules/ArticleLink/ArticleLink"
import { GetStaticPropsResult, NextPage } from "next"
import { ArticlePreview, getAllArticles } from "../lib/articlesApi"

interface Props {
  articles: ArticlePreview[]
}

const Home: NextPage<Props> = ({ articles }) => {
  return (
    <article className="max-w-prose w-full h-fit p-8">
      <h1 className="text-4xl mb-8">Articles</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article) => (
          <ArticleLink key={article.slug} article={article} />
        ))}
      </section>
    </article>
  )
}

export function getStaticProps(): GetStaticPropsResult<Props> {
  return {
    props: {
      articles: getAllArticles(),
    },
    revalidate: 600,
  }
}

export default Home
