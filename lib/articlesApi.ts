import fs from "fs"
import { join } from "path"
import matter from "gray-matter"

export interface Article {
  slug: string
  content: string
  title: string
  [key: string]: any
}

export interface ArticlePreview {
  slug: string
  title: string
  subtitle?: string
  image?: string
  tags: string[]
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
  
  if (previewDataOnly) {
    const previewData: ArticlePreview = {
      slug,
      title,
      subtitle: data.subtitle,
      image: data.image,
      tags: data.tags,
    }
    return previewData as any
  } else {
    const fullData: Article = {
      ...data,
      title,
      slug,
      content,
    }
    return fullData as any
  }
}

export const getAllArticles = (subdir: ArticleSubdir) => {
  const slugs = getArticleFileNames(subdir)
  const articles = slugs
    .map((slug) => getArticle(subdir, slug, true))
    .sort((a, b) => (a.title < b.title ? -1 : 1))
  return articles
}
