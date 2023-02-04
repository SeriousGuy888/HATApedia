import Head from "next/head"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import { Article, getAllSlugs, getArticle } from "../../lib/articlesApi"
import NationInfoCard from "../../modules/ArticleComponents/NationInfoCard"
import styles from "../../modules/ArticleComponents/Article.module.scss"

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
import rehypeWrap from "rehype-wrap-all"

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
      <div className="max-w-[95vw] md:max-w-prose w-full h-fit p-8">
        <div className="flex-1 self-start">
          <h1 className="text-5xl font-bold mb-2">{article.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 uppercase text-sm">
            {article.subtitle}
          </p>
          <hr className="my-6 border-t-[1] border-gray-200 dark:border-gray-700" />
        </div>

        {article.nation && <NationInfoCard nation={article.nation} />}
        <article
          className={"prose prose-base dark:prose-invert " + styles.prose}
          dangerouslySetInnerHTML={{ __html: html }}
        />
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
  if (!article) {
    return {
      notFound: true,
    }
  }

  const file = await unified()
    .use(remarkGfm)
    .use(remarkToc, { tight: true })
    .use(remarkHtml)
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeFormat)
    .use(rehypeWrap, {
      selector: "table",
      wrapper: `div.${styles.responsiveTable}`,
    })
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
  const slugs = getAllSlugs()

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  }
}

export default ArticlePage
