import Head from "next/head"
import Image from "next/image"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import { ArticleFull, getAllSlugs, getArticle } from "../../lib/articlesApi"
import NationInfoCard from "../../modules/ArticleComponents/NationInfoCard"
import styles from "../../modules/ArticleComponents/Article.module.scss"
import ReactMarkdown from "react-markdown"

import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkWikilink from "../../plugins/remark-wikilink-syntax"
import remarkToc from "remark-toc"
import remarkParse from "remark-parse"
import remarkHtml from "remark-html"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeFormat from "rehype-format"
import rehypeStringify from "rehype-stringify"
import rehypeWrap from "rehype-wrap-all"
import strip from "strip-markdown"

interface Props {
  article: ArticleFull
  content: string
  excerpt: string
  allSlugs: string[]
}

const ArticlePage: NextPage<Props> = ({
  article,
  content,
  excerpt,
  allSlugs,
}) => {
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
        >
          <MarkdownRenderer content={content} allSlugs={allSlugs} />
        </article>
      </div>
    </>
  )
}

const markdownComponents = {
  img: (image: { src?: string; alt?: string }) => (
    <Image
      src={image.src ?? ""}
      alt={image.alt ?? ""}
      width={700}
      height={350}
    />
  ),
}

const MarkdownRenderer = ({
  content,
  allSlugs,
}: {
  content: string
  allSlugs: string[]
}) => {
  return (
    <ReactMarkdown
      components={markdownComponents}
      remarkPlugins={[
        remarkParse,
        remarkGfm,
        [remarkWikilink, { existingPageNames: allSlugs }],
        [remarkToc, { tight: true }],
        remarkHtml,
      ]}
      rehypePlugins={[
        rehypeSlug,
        rehypeAutolinkHeadings,
        [
          rehypeWrap,
          {
            selector: "table",
            wrapper: `div.${styles.responsiveTable}`,
          },
        ],
        rehypeFormat,
        rehypeStringify,
      ]}
    >
      {content}
    </ReactMarkdown>
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

  const allSlugs = await getAllSlugs()

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
      content: article.content,
      allSlugs,
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
