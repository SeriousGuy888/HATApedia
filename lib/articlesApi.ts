import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { NationInfoCardData } from "../modules/ArticleComponents/NationInfoCard"
import { sluggify } from "../utils/sluggify.js"
import { generateArticleSlugs, slugsFile } from "./generateArticleSlugs"

import { serialize } from "next-mdx-remote/serialize"

import remarkGfm from "remark-gfm"
import remarkWikilink from "../plugins/remark-wikilink-syntax"
import remarkToc from "remark-toc"
import remarkParse from "remark-parse"
import remarkHtml from "remark-html"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeFormat from "rehype-format"
import rehypeStringify from "rehype-stringify"
import rehypeWrap from "rehype-wrap-all"
import { remark } from "remark"
import strip from "strip-markdown"

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

export const articlesDir = path.join(process.cwd(), "/content/articles/")

let slugMap: null | { [slug: string]: string } = null
const getSlugMap = async () => {
  if (!slugMap) {
    try {
      const fileStats = await fs.stat(slugsFile)
      if (Date.now() - fileStats.mtime.valueOf() > 1000 * 60 * 60 * 24) {
        slugMap = await generateArticleSlugs()
      }
    } catch (e) {
      slugMap = await generateArticleSlugs()
    }
    const fileContent = await fs.readFile(slugsFile, "utf8")
    slugMap = JSON.parse(fileContent)
  }
  if (slugMap === null) {
    throw new Error("Slug map is null")
  }
  return slugMap
}

export const getAllSlugs = async () => {
  const slugs = (await fs.readdir(articlesDir)).map(sluggify)

  const uniqueSlugs = new Set(slugs)
  if (slugs.length !== uniqueSlugs.size) {
    console.warn("Duplicate article slugs found!")
  }

  return Object.keys(await getSlugMap())
}

const getArticleFileContent = async (slug: string) => {
  const slugMap = await getSlugMap()
  const fileName = slugMap?.[slug]
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
    obj.title = (await getSlugMap())?.[obj.slug].replace(/\.mdx?$/, "")
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
        [remarkToc, { tight: true }],
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

  return {
    mdxSource,
    excerpt,
    fileName: (await getSlugMap())?.[slug],
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
