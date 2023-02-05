import fs from "fs"
import { join } from "path"
import matter from "gray-matter"
import { NationInfoCardData } from "../modules/ArticleComponents/NationInfoCard"

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

const articlesDir = join(process.cwd(), "/content/articles/")

const sluggify = (fileName: string) => fileName.replace(/\.md$/, "")

export const getAllSlugs = () => {
  return fs.readdirSync(articlesDir).map(sluggify)
}

const getArticleFileContent = (slugOrFileName: string) => {
  const slug = sluggify(slugOrFileName)
  const filePath = join(articlesDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath, "utf8")
}

const handleUndefinedKeys = (obj: Article | ArticlePreview) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      if (key === "title") {
        obj[key] = "Untitled"
      } else {
        delete obj[key]
      }
    }
  })
  return obj
}

export const getArticle = (slug: string) => {
  const fileContents = getArticleFileContent(slug)
  if (!fileContents) {
    return null
  }
  const { data, content } = matter(fileContents)

  let returnData: Article = {
    ...data,
    title: data.title,
    slug,
    content,
  }

  return handleUndefinedKeys(returnData)
}

export const getArticlePreview = (slug: string) => {
  const fileContents = getArticleFileContent(slug)
  if (!fileContents) {
    return null
  }
  const { data } = matter(fileContents)

  let returnData: ArticlePreview = {
    slug,
    title: data.title,
    subtitle: data.subtitle,
    image: data.image || data.nation?.banner,
  }

  return handleUndefinedKeys(returnData)
}
