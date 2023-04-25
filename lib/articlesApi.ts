import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { NationInfoCardData } from "../modules/ArticleComponents/NationInfoCard"

import { serialize } from "next-mdx-remote/serialize"

import remarkGfm from "remark-gfm"
import remarkWikilink from "../plugins/remark-wikilink-syntax"
import remarkParse from "remark-parse"
import remarkHtml from "remark-html"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeFormat from "rehype-format"
import rehypeStringify from "rehype-stringify"
import rehypeWrap from "rehype-wrap-all"
import { remark } from "remark"
import strip from "strip-markdown"

import remarkHeadingTree, { TocNode } from "../plugins/remark-heading-tree"

export interface Article {
  slug: string
  title: string
  subtitle?: string
  image?: string
  nation?: NationInfoCardData
}
export interface ArticleFull extends Article {
  content: string
}

const articlesDir = path.join(process.cwd(), "/content/articles/")

const getSlugMap = async () =>
  (await import("../cache/article_slugs.json")).default as {
    [slug: string]: string
  }

export const getAllSlugs = async () => {
  return Object.keys(await getSlugMap())
}

const getArticleFileContent = async (slug: string) => {
  const slugMap = await getSlugMap()
  const fileName = (slugMap as any)?.[slug]

  if (!fileName) {
    return null
  }

  const filePath = path.join(articlesDir, fileName)
  if (!(await fs.stat(filePath)).isFile()) {
    return null
  }
  return fs.readFile(filePath, "utf8")
}

const handleUndefinedKeys = async (obj: Article | ArticleFull) => {
  const { title, subtitle } = obj
  if (!title) {
    // If no title specified, use the filename without the extension as title
    obj.title = ((await getSlugMap()) as any)?.[obj.slug].replace(/\.mdx?$/, "")
  }
  if (!subtitle) {
    delete obj.subtitle
  }

  return obj
}

export const getArticle = async (slug: string) => {
  const source = await getArticleFileContent(slug)
  if (!source) {
    return null
  }

  const allSlugs = await getAllSlugs()

  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [
        remarkParse,
        remarkGfm,
        [remarkWikilink, { existingPageNames: allSlugs }],
        remarkHtml,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        [
          rehypeWrap,
          {
            selector: "table",
            wrapper: `div.responsive-table`,
          },
        ],
        rehypeFormat,
        rehypeStringify,
      ],
    },
    parseFrontmatter: true,
  })

  const { content } = matter(source)
  const excerpt =
    (
      await remark().use(remarkGfm).use(strip).process(content.slice(0, 197))
    ).value
      .toString()
      .replace(/\n/g, " ") + "..."

  const tocHeadings = (
    await remark().use(remarkParse).use(remarkHeadingTree).process(content)
  ).data.headings as TocNode[]

  return {
    mdxSource,
    excerpt,
    tocHeadings,
    fileName: ((await getSlugMap()) as any)?.[slug],
  }
}

export const getArticlePreview = async (slug: string) => {
  const fileContents = await getArticleFileContent(slug)
  if (!fileContents) {
    return null
  }
  const { data } = matter(fileContents)
  const { title, subtitle, nation } = data

  return (await handleUndefinedKeys({
    slug,
    title,
    subtitle,
    image: data?.image ?? nation?.banner ?? null,
  })) as Article
}
