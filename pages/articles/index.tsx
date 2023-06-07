import Head from "next/head"
import ArticleSearch from "../../modules/Search/ArticleSearch"

const ArticlesDirectory = () => {
  return (
    <>
      <Head>
        <title>Articles - HATApedia</title>
      </Head>
      <article className="h-fit p-8 w-full md:max-w-5xl">
        <h1 className="text-4xl mb-8">Articles</h1>

        <ArticleSearch />
      </article>
    </>
  )
}

export default ArticlesDirectory
