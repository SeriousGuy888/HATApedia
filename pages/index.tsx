import NationCard from "../modules/NationCard/NationCard"
import { GetStaticPropsResult, NextPage } from "next"
import { ArticlePreview, getAllArticles } from "../lib/articlesApi"

interface Props {
  nations: ArticlePreview[]
}

const Home: NextPage<Props> = ({ nations }) => {
  return (
    <div className="flex justify-center w-full p-4">
      <article className="max-w-prose w-full">
        <h1 className="text-4xl mb-8">Political Entities</h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nations.map((nation) => (
            <NationCard key={nation.slug} article={nation} />
          ))}
        </section>
      </article>
    </div>
  )
}

export function getStaticProps(): GetStaticPropsResult<Props> {
  return {
    props: {
      nations: getAllArticles(),
    },
    revalidate: 600,
  }
}

export default Home
