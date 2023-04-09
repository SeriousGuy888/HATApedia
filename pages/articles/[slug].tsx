import Head from "next/head"
import Image from "next/image"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import { Article, getAllSlugs, getArticle } from "../../lib/articlesApi"
import NationInfoCard from "../../modules/ArticleComponents/NationInfoCard"
import styles from "../../modules/ArticleComponents/Article.module.scss"

import type { MDXRemoteSerializeResult } from "next-mdx-remote"
import { MDXRemote } from "next-mdx-remote"

import { remark } from "remark"
import remarkGfm from "remark-gfm"
import strip from "strip-markdown"
import MDXComponents from "../../modules/ArticleComponents/MDXComponents"

interface Props {
  mdxSource: MDXRemoteSerializeResult
  excerpt: string
}

const ArticlePage: NextPage<Props> = ({ mdxSource, excerpt }) => {
  const data = mdxSource.scope as unknown as Article

  return (
    <>
      <Head>
        <title>{`${data.title} - HATApedia`}</title>
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:type" content="article" />
        {(data.image) && (
          <meta
            property="og:image"
            content={`https://hatapedia.vercel.app${data.image}`}
          />
        )}
      </Head>
      <div className="max-w-[95vw] md:max-w-prose w-full h-fit p-8">
        <div className="flex-1 self-start flex justify-between">
          <div className="">
            <h1 className="text-5xl font-bold mb-2">{data.title}</h1>
            <h2 className="text-gray-600 dark:text-gray-400 uppercase text-sm">
              {data.subtitle}
            </h2>
          </div>
          {data.image && !data.nation && (
            <div className="rounded-xl p-2 bg-gray-100 dark:bg-gray-800">
              <Image
                src={data.image}
                alt=""
                width={100}
                height={100}
              />
            </div>
          )}
        </div>
        <hr className="my-6 border-t-[1] border-gray-200 dark:border-gray-700" />

        {data.nation as any && <NationInfoCard nation={data.nation as any} />}
        <article
          className={"prose prose-base dark:prose-invert " + styles.prose}
        >
          <MDXRemote {...mdxSource} components={MDXComponents} />
        </article>
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

  const excerpt =
    (
      await remark()
        .use(remarkGfm)
        .use(strip)
        .process(article.compiledSource.slice(0, 197))
    ).value
      .toString()
      .replace(/\n/g, " ") + "..."

  return {
    props: {
      excerpt,
      mdxSource: article,
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
