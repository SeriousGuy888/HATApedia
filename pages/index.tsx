import NationCard from "../modules/NationCard/NationCard"
import { GetStaticPropsResult, NextPage } from "next"
import { ArticlePreview, getAllArticles } from "../lib/articlesApi"

interface Props {
  nations: ArticlePreview[]
}

const Home: NextPage<Props> = ({ nations }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <article className="max-w-screen-md w-full">
        <h1 className="text-4xl mb-8">Political Entities</h1>

        <section className="flex flex-row flex-wrap gap-4">
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
