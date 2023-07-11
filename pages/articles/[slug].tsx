import Head from "next/head"
import styles from "../../modules/ArticleComponents/Article.module.scss"
import "@portaljs/remark-callouts/styles.css"

import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import { ArticlePreview, getAllSlugs, getArticle } from "../../lib/articlesApi"
import type { MDXRemoteSerializeResult } from "next-mdx-remote"
import { MDXRemote } from "next-mdx-remote"

import MDXComponents from "../../modules/ArticleComponents/MDXComponents"
import type { TocNode } from "../../plugins/remark-heading-tree"
import FloatingTableOfContents from "../../modules/ArticleComponents/FloatingTableOfContents"
import { getImgWikilinkSrc } from "../../lib/wikilinkParser"
import { motion } from "framer-motion"

interface Props {
  mdxSource: MDXRemoteSerializeResult
  excerpt: string
  tocHeadings: TocNode[]
  fileName: string
}

const ArticlePage: NextPage<Props> = ({
  mdxSource,
  excerpt,
  tocHeadings,
  fileName,
}) => {
  const frontmatter = mdxSource.frontmatter as unknown as ArticlePreview

  const title = frontmatter.title ?? fileName.replace(/.mdx?$/, "")

  return (
    <>
      <Head>
        <title>{`${title} - HATApedia`}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:type" content="article" />
        {frontmatter.image && (
          <meta
            property="og:image"
            content={
              "https://hatapedia.vercel.app" +
              getImgWikilinkSrc(frontmatter.image)
            }
          />
        )}
      </Head>
      <section
        className={`max-w-[90vw] lg:max-w-[75vw] xl:max-w-screen-lg w-full py-8 h-fit md:grid grid-cols-[3fr_1fr] gap-8`}
        id="_top"
      >
        <div className="max-w-prose">
          <header>
            <section>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2 print:text-black break-words">
                {title}
              </h1>
              <h2 className="text-gray-600 dark:text-gray-400 uppercase text-sm break-words">
                {frontmatter.subtitle}
              </h2>
            </section>
            <hr className="my-8 border-t-[1] border-gray-200 dark:border-gray-700" />
          </header>
          <motion.article
            className={`prose prose-base dark:prose-invert print:prose-print pb-48 ${styles.prose}`}
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <MDXRemote {...mdxSource} components={MDXComponents as any} />
          </motion.article>
        </div>

        <FloatingTableOfContents nodes={tocHeadings} />
      </section>
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

  return {
    props: article,
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
