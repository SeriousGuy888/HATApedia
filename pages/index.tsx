import ArticleLink from "../modules/ArticleLink/ArticleLink"
import { GetStaticPropsResult, NextPage } from "next"
import { getAllSlugs } from "../lib/articlesApi"

interface Props {
  slugs: string[]
}

const Home: NextPage<Props> = ({ slugs }) => {
  return (
    <article className="max-w-prose w-full h-fit p-8">
      <h1 className="text-4xl mb-8">Articles</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {slugs.map((slug) => (
          <ArticleLink key={slug} slug={slug} />
        ))}
      </section>
    </article>
  )
}

export function getStaticProps(): GetStaticPropsResult<Props> {
  return {
    props: {
      slugs: getAllSlugs(),
    },
    revalidate: 600,
  }
}

export default Home
