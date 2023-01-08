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
  excerpt: string
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
  const slug = slugOrFileName.replace(/\.md$/, "")
  const filePath = join(articlesDir, `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  const frontMatter = data

  if (previewDataOnly) {
    const previewData: ArticlePreview = {
      slug,
      title: frontMatter.title || "Untitled",
      excerpt: "Excerpt",
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

export const getAllArticles = () => {
  const slugs = getArticleFileNames()
  const articles = slugs
    .map((slug) => getArticle(slug, true))
    .sort((post1, post2) => (post1.title > post2.title ? -1 : 1))
  return articles
}