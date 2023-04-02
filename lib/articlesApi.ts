import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { NationInfoCardData } from "../modules/ArticleComponents/NationInfoCard"
import { sluggify } from "../utils/sluggify.js"
import { generateArticleSlugs, slugsFile } from "./generateArticleSlugs"

export interface Article {
  slug: string
  content: string
  title: string
  nation?: NationInfoCardData
  [key: string]: any
}

export interface ArticlePreview {
  slug: string
  title: string
  subtitle?: string
  image?: string
  [key: string]: any
}

const articlesDir = path.join(process.cwd(), "/content/articles/")

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

const handleUndefinedKeys = <T extends Article | ArticlePreview>(obj: T) => {
  const { title, subtitle, image, nation } = obj
  if (!title) {
    obj.title = "Untitled"
  }
  if (!subtitle) {
    delete obj.subtitle
  }
  if (!image) {
    obj.image = nation?.banner ?? null
  }

  return obj
}

export const getArticle = async (slug: string) => {
  const fileContents = await getArticleFileContent(slug)
  if (!fileContents) {
    return null
  }
  const { data, content } = matter(fileContents)
  const { title = "Untitled" } = data

  return handleUndefinedKeys({
    ...data,
    title,
    slug,
    content,
  })
}

export const getArticlePreview = async (slug: string) => {
  const fileContents = await getArticleFileContent(slug)
  if (!fileContents) {
    return null
  }
  const { data } = matter(fileContents)
  const { title = "Untitled", subtitle, nation } = data

  return handleUndefinedKeys({
    slug,
    title,
    subtitle,
    image: data?.image ?? nation?.banner ?? null,
  })
}
