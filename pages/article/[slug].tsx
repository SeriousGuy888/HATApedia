import Head from "next/head"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import { Article, getAllArticles, getArticle } from "../../lib/articlesApi"
import NationInfoCard from "../../modules/ArticleComponents/NationInfoCard"

import { unified } from "unified"
import remarkGfm from "remark-gfm"
import remarkToc from "remark-toc"
import remarkParse from "remark-parse"
import remarkHtml from "remark-html"
import remarkRehype from "remark-rehype"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeFormat from "rehype-format"
import rehypeStringify from "rehype-stringify"

interface Props {
  article: Article
  html: string
}

const ArticlePage: NextPage<Props> = ({ article, html }) => {
  return (
    <>
      <Head>
        <title>{`${article.title} - HATApedia`}</title>
      </Head>
      <div className="flex flex-col items-center mb-16">
        <div className="max-w-prose">
          <div className="flex-1 self-start ">
            <h1 className="text-5xl font-bold mb-2">{article.title}</h1>
            <p className="text-gray-600 uppercase text-sm">
              {article.subtitle}
            </p>
            <hr className="my-6" />
          </div>

          {article.nation && <NationInfoCard nation={article.nation} />}
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<GetStaticPropsResult<Props>> {
  const article = getArticle(slug, false)

  const file = await unified()
    .use(remarkGfm)
    .use(remarkToc)
    .use(remarkHtml)
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(article.content)

  return {
    props: {
      article,
      html: String(file),
    },
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const articles = getAllArticles()

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: false,
  }
}

export default ArticlePage
