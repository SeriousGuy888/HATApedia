import Head from "next/head"
import ArticleSearch from "../../modules/Search/ArticleSearch"

const ArticlesDirectory = () => {
  return (
    <>
      <Head>
        <title>Articles - HATApedia</title>
      </Head>
      <article className="max-w-5xl w-full h-fit p-8">
        <h1 className="text-4xl mb-8">Articles</h1>

        <ArticleSearch />
      </article>
    </>
  )
}

export default ArticlesDirectory
