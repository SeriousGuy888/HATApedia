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

const getArticleFileNames = () => {
  return fs.readdirSync(articlesDir)
}

// returns Article or ArticlePreview based on param
export const getArticle = <B extends boolean>(
  slugOrFileName: string,
  previewDataOnly: B,
): (B extends true ? ArticlePreview : Article) | null => {
  const slug = sluggify(slugOrFileName)
  const filePath = join(articlesDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  const title = data.title || "Untitled"

  let returnData = {} as ArticlePreview | Article
  if (previewDataOnly) {
    returnData = {
      slug,
      title,
      subtitle: data.subtitle,
      image: data.image || data.nation?.banner,
    }
  } else {
    returnData = {
      ...data,
      title,
      slug,
      content,
    }
  }

  Object.keys(returnData).forEach((key) => {
    if (returnData[key] === undefined) {
      delete returnData[key]
    }
  })
  return returnData as any
}

export const getAllSlugs = () => {
  return getArticleFileNames().map(sluggify)
}
