import NationCard from "../modules/NationCard/NationCard"
import { GetStaticPropsResult, NextPage } from "next"
import { ArticlePreview, getAllArticles } from "../lib/articlesApi"

interface Props {
  nations: ArticlePreview[]
}

const Home: NextPage<Props> = ({ nations }) => {
  return (
    <div>
      <h2>Political Entities</h2>
      {nations.map((nation) => (
        <NationCard key={nation.slug} article={nation} />
      ))}
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
