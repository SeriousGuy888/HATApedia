import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

import { serialize } from "next-mdx-remote/serialize"

import remarkGfm from "remark-gfm"
import remarkWikilink from "../plugins/remark-wikilink-syntax"
import remarkYamlComponents from "../plugins/remark-yaml-components"
import remarkGroupImages from "../plugins/remark-group-images"
import remarkParse from "remark-parse"
import remarkHtml from "remark-html"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkCallouts from "@portaljs/remark-callouts"
import rehypeFormat from "rehype-format"
import rehypeStringify from "rehype-stringify"
import rehypeWrap from "rehype-wrap-all"
import { remark } from "remark"
import strip from "strip-markdown"

import remarkHeadingTree, { TocNode } from "../plugins/remark-heading-tree"

export interface ArticlePreview {
  slug: string
  title: string
  subtitle?: string
  image?: string
}
interface ArticleMetadata extends ArticlePreview {
  timeline?: {
    events?: {
      date: Date | { start: Date; end: Date }
      title: string
      description?: string
    }[]
  }
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

const goodifyArticleData = async (obj: ArticlePreview | ArticleMetadata) => {
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

export async function getArticle(slug: string) {
  const source = await getArticleFileContent(slug)
  if (!source) {
    return null
  }

  const allSlugs = await getAllSlugs()
  const { content } = matter(source)

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkParse,
        remarkGfm,
        [remarkWikilink, { existingPageNames: allSlugs }],
        [
          remarkYamlComponents,
          {
            conversionMap: {
              "infobox-nation": "NationInfobox",
              "infobox-character": "CharacterInfobox",
              "infobox-timeline": "TimelineInfobox",
            },
          },
        ],
        remarkCallouts,
        remarkGroupImages,
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
  })

  // makes Date serialisation error go away for some reason
  mdxSource.frontmatter = (await getArticlePreview(slug)) as any

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

export async function getArticlePreview(slug: string) {
  const metadata = await getArticleMetadata(slug)
  if (!metadata) {
    return null
  }

  const { title, subtitle, image } = metadata

  return (await goodifyArticleData({
    slug,
    title,
    subtitle,
    image,
  })) as ArticlePreview
}

export async function getArticleMetadata(slug: string) {
  const source = await getArticleFileContent(slug)
  if (!source) {
    return null
  }
  const { data } = matter(source)
  const { title, subtitle, image, nation, timeline } = data

  const articleData: ArticleMetadata = await goodifyArticleData({
    slug,
    title,
    subtitle,
    image: image ?? nation?.banner ?? null,
    timeline,
  })

  return articleData
}
