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
import { getBacklinksTo } from "../../lib/articleSlugManager"
import { motion } from "framer-motion"
import cntl from "cntl"
import Link from "next/link"

interface Props {
  article: {
    mdxSource: MDXRemoteSerializeResult
    excerpt: string
    tocHeadings: TocNode[]
    fileName: string
  }
  backlinks: { slug: string; title: string }[]
}

const ArticlePage: NextPage<Props> = ({
  article: { mdxSource, excerpt, tocHeadings, fileName },
  backlinks,
}) => {
  const frontmatter = mdxSource.frontmatter as unknown as ArticlePreview
  const title = frontmatter.title ?? fileName.replace(/.mdx?$/, "")

  const hrStyle = cntl`my-8 border-t-[1] border-gray-200 dark:border-gray-700`

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
      <div className="py-8 max-w-[90vw] lg:max-w-[75vw] xl:max-w-screen-lg grid gap-12">
        <section className="md:grid grid-cols-[3fr_1fr] gap-8" id="_top">
          <div className="max-w-prose min-w-0">
            <header>
              <section>
                <h1 className="text-4xl sm:text-5xl font-bold mb-2 print:text-black break-words">
                  {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 uppercase text-sm break-words">
                  {frontmatter.subtitle}
                </p>
              </section>
              <hr className={hrStyle} />
            </header>
            <motion.article
              className={`prose prose-base dark:prose-invert print:prose-print ${styles.prose}`}
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <MDXRemote {...mdxSource} components={MDXComponents as any} />
            </motion.article>
          </div>

          <aside className="min-w-0 min-h-0">
            <div className="md:sticky md:top-24">
              <FloatingTableOfContents nodes={tocHeadings} />
            </div>
          </aside>
        </section>

        <hr className={hrStyle} />

        <section id="_backlinks" className="max-w-full w-full">
          <h2 className="text-3xl font-bold mb-2">Backlinks</h2>
          <p className="pb-8">
            <em>{title}</em> is also mentioned (linked) elsewhere on HATApedia
            in the following articles:
          </p>

          <ul className="list-disc list-inside grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-y-0 gap-x-4 prose dark:prose-invert max-w-none w-full">
            {backlinks.map((backlink) => (
              <li
                key={backlink.slug}
                className="whitespace-nowrap text-ellipsis overflow-clip min-w-0"
              >
                <Link href={`/articles/${backlink.slug}`}>
                  {backlink.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<GetStaticPropsResult<Props>> {
  const backlinks = await getBacklinksTo(slug)

  const article = await getArticle(slug)
  if (!article) {
    return {
      notFound: true,
    }
  }

  return {
    props: { article, backlinks },
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
