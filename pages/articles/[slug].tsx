import Head from "next/head"
import Image from "next/image"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import { Article, getAllSlugs, getArticle } from "../../lib/articlesApi"
import NationInfoCard from "../../modules/ArticleComponents/NationInfoCard"
import styles from "../../modules/ArticleComponents/Article.module.scss"

import { unified } from "unified"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkWikilink from "../../plugins/remark-wikilink-syntax"
import remarkToc from "remark-toc"
import remarkParse from "remark-parse"
import remarkHtml from "remark-html"
import remarkRehype from "remark-rehype"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeFormat from "rehype-format"
import rehypeStringify from "rehype-stringify"
import rehypeWrap from "rehype-wrap-all"
import strip from "strip-markdown"

interface Props {
  article: Article
  html: string
  excerpt: string
}

const ArticlePage: NextPage<Props> = ({ article, html, excerpt }) => {
  return (
    <>
      <Head>
        <title>{`${article.title} - HATApedia`}</title>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:type" content="article" />
        {article.image && (
          <meta
            property="og:image"
            content={"https://hatapedia.vercel.app" + article.image}
          />
        )}
      </Head>
      <div className="max-w-[95vw] md:max-w-prose w-full h-fit p-8">
        <div className="flex-1 self-start flex justify-between">
          <div className="">
            <h1 className="text-5xl font-bold mb-2">{article.title}</h1>
            <h2 className="text-gray-600 dark:text-gray-400 uppercase text-sm">
              {article.subtitle}
            </h2>
          </div>
          {article.image && !article.nation && (
            <div className="rounded-xl p-2 bg-gray-100 dark:bg-gray-800">
              <Image src={article.image} alt="" width={100} height={100} />
            </div>
          )}
        </div>
        <hr className="my-6 border-t-[1] border-gray-200 dark:border-gray-700" />

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
  const article = await getArticle(slug)
  if (!article) {
    return {
      notFound: true,
    }
  }

  const allPermalinks = await getAllSlugs()

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilink, { existingPageNames: allPermalinks })
    .use(remarkToc, { tight: true })
    .use(remarkHtml)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "append" })
    .use(rehypeFormat)
    .use(rehypeWrap, {
      selector: "table",
      wrapper: `div.${styles.responsiveTable}`,
    })
    .use(rehypeWrap, {
      selector: "a.redLink",
      wrapper: `span.${styles.redLink}`,
    })
    .use(rehypeStringify)
    .process(article.content)

  const excerpt =
    (
      await remark()
        .use(remarkGfm)
        .use(strip)
        .process(article.content.slice(0, 197))
    ).value
      .toString()
      .replace(/\n/g, " ") + "..."

  return {
    props: {
      article,
      excerpt,
      html: String(file),
    },
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const slugs = await getAllSlugs()

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
