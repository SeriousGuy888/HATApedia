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
      <div>
        <h1>{article.title}</h1>
        <span>{article.subtitle}</span>

        <div>
          {article.nation && <NationInfoCard nation={article.nation} />}
          <article dangerouslySetInnerHTML={{ __html: html }} />
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
