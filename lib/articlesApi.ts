import fs from "fs"
import { join } from "path"
import matter from "gray-matter"

export interface Article {
  slug: string
  content: string
  title: string
  nation?: NationData
  [key: string]: any
}

export interface ArticlePreview {
  slug: string
  title: string
  subtitle?: string
  image?: string
  [key: string]: any
}

export interface NationData {
  banner?: string
  info: {
    [key: string]: any
  }
}

export type ArticleSubdir = "nations"

const articlesDir = join(process.cwd(), "/content/articles/")

const getArticleFileNames = (subdir: ArticleSubdir) => {
  return fs.readdirSync(join(articlesDir, subdir))
}

// returns Article or ArticlePreview based on param
export const getArticle = <B extends boolean>(
  subdir: ArticleSubdir,
  slugOrFileName: string,
  previewDataOnly: B,
): B extends true ? ArticlePreview : Article => {
  const slug = slugOrFileName.replace(/\.md$/, "")
  const filePath = join(articlesDir, subdir, `${slug}.md`)
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

  Object.keys(returnData).forEach(key => {
    if (returnData[key] === undefined) {
      delete returnData[key]
    }
  });
  return returnData as any
}

export const getAllArticles = (subdir: ArticleSubdir) => {
  const slugs = getArticleFileNames(subdir)
  const articles = slugs
    .map((slug) => getArticle(subdir, slug, true))
    .sort((a, b) => (a.title < b.title ? -1 : 1))
  return articles
}
