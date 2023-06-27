import Head from "next/head"
import Image from "next/image"
import styles from "../../modules/ArticleComponents/Article.module.scss"

import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import { Article, getAllSlugs, getArticle } from "../../lib/articlesApi"
import type { MDXRemoteSerializeResult } from "next-mdx-remote"
import { MDXRemote } from "next-mdx-remote"

import MDXComponents from "../../modules/ArticleComponents/MDXComponents"
import NationInfobox from "../../modules/ArticleComponents/Infoboxes/NationInfobox"
import type { TocNode } from "../../plugins/remark-heading-tree"
import FloatingTableOfContents from "../../modules/ArticleComponents/FloatingTableOfContents"
import { getImgWikilinkSrc } from "../../lib/wikilinkParser"

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
  const frontmatter = mdxSource.frontmatter as unknown as Article

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
        className={`max-w-[90vw] lg:max-w-[75vw] xl:max-w-screen-lg w-full py-8 h-fit md:grid grid-cols-[3fr_1fr] gap-12`}
        id="_top"
      >
        <div>
          <header>
            <div className="flex flex-row justify-between gap-4">
              <section>
                <h1 className="text-5xl font-bold mb-2 print:text-black">
                  {title}
                </h1>
                <h2 className="text-gray-600 dark:text-gray-400 uppercase text-sm">
                  {frontmatter.subtitle}
                </h2>
              </section>
              {frontmatter.image && !frontmatter.nation && (
                <figure className="rounded-xl p-2 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={getImgWikilinkSrc(frontmatter.image)}
                    alt=""
                    width={100}
                    height={100}
                  />
                </figure>
              )}
            </div>
            <hr className="my-8 border-t-[1] border-gray-200 dark:border-gray-700" />
          </header>

          {(frontmatter.nation as any) && (
            <NationInfobox
              facts={frontmatter.nation?.info}
              banner={frontmatter.nation?.banner}
            />
          )}
          <article
            className={
              "prose prose-base dark:prose-invert print:prose-print " +
              styles.prose
            }
          >
            <MDXRemote {...mdxSource} components={MDXComponents as any} />
          </article>
        </div>

        <aside>
          <FloatingTableOfContents nodes={tocHeadings} />
        </aside>
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
