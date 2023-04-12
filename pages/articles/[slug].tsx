import Head from "next/head"
import Image from "next/image"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import { Article, getAllSlugs, getArticle } from "../../lib/articlesApi"
import NationInfoCard from "../../modules/ArticleComponents/NationInfoCard"
import styles from "../../modules/ArticleComponents/Article.module.scss"

import type { MDXRemoteSerializeResult } from "next-mdx-remote"
import { MDXRemote } from "next-mdx-remote"
import MDXComponents from "../../modules/ArticleComponents/MDXComponents"
import { TocNode } from "../../plugins/remark-heading-tree"
import FloatingTableOfContents from "../../modules/ArticleComponents/FloatingTableOfContents"

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
            content={`https://hatapedia.vercel.app${frontmatter.image}`}
          />
        )}
      </Head>
      <section
        className="max-w-[95vw] md:grid grid-cols-[3fr_1fr] gap-8 py-8 h-fit"
        id="_top"
      >
        <div className="w-full h-fit md:max-w-prose">
          <div className="flex-1 self-start flex justify-between">
            <div className="">
              <h1 className="text-5xl font-bold mb-2">{title}</h1>
              <h2 className="text-gray-600 dark:text-gray-400 uppercase text-sm">
                {frontmatter.subtitle}
              </h2>
            </div>
            {frontmatter.image && !frontmatter.nation && (
              <div className="rounded-xl p-2 bg-gray-100 dark:bg-gray-800">
                <Image
                  src={frontmatter.image}
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>
          <hr className="my-8 border-t-[1] border-gray-200 dark:border-gray-700" />

          {(frontmatter.nation as any) && (
            <NationInfoCard nation={frontmatter.nation as any} />
          )}
          <article
            className={"prose prose-base dark:prose-invert " + styles.prose}
          >
            <MDXRemote {...mdxSource} components={MDXComponents} />
          </article>
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
