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

const articlesDir = join(process.cwd(), "/content/articles")

export const getArticleFileNames = () => {
  return fs.readdirSync(articlesDir)
}

// returns Article or ArticlePreview based on param
export const getArticle = <B extends boolean>(
  slugOrFileName: string,
  previewDataOnly: B,
): B extends true ? ArticlePreview : Article => {
  const slug = slugOrFileName.replace(/\.mdx$/, "")
  const filePath = join(articlesDir, `${slug}.mdx`)
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  let frontMatter = data
  if (!(frontMatter.tags instanceof Array)) {
    frontMatter.tags = []
  }
  frontMatter.tags = frontMatter.tags.map((tag: string) => tag.toLowerCase())

  if (previewDataOnly) {
    const previewData: ArticlePreview = {
      slug,
      title: frontMatter.title || "Untitled",
      subtitle: frontMatter.subtitle,
      image: frontMatter.image,
      tags: frontMatter.tags,
    }
    return previewData as any
  } else {
    const fullData: Article = {
      ...frontMatter,
      title: frontMatter.title ?? "Untitled",
      slug,
      content,
    }
    return fullData as any
  }
}

export const getAllArticles = (tagFilter?: string) => {
  const slugs = getArticleFileNames()
  const articles = slugs
    .map((slug) => getArticle(slug, true))
    .filter((article) =>
      tagFilter ? article.tags.includes(tagFilter.toLowerCase()) : true,
    )
    .sort((a, b) => (a.title < b.title ? -1 : 1))
  return articles
}
