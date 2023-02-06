import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import algoliasearch from "algoliasearch/lite.js"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import strip from "strip-markdown"

dotenv.config()
const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const SEARCH_ADMIN_KEY = process.env.ALGOLIA_SEARCH_ADMIN_KEY

if (!APP_ID || !SEARCH_ADMIN_KEY) {
  console.error(new Error("Missing environment variables!"))
  process.exit(1)
}

const CONTENT_PATH = path.join(process.cwd(), "/content/articles/")
const contentFilePaths = fs
  .readdirSync(CONTENT_PATH)
  .filter((p) => p.endsWith(".md"))

const getAllArticles = async () => {
  const articles = contentFilePaths.map((fileName) => {
    const source = fs.readFileSync(path.join(CONTENT_PATH, fileName))
    const { content, data } = matter(source)
    return {
      content,
      data,
      slug: fileName.replace(/\.md$/, ""),
    }
  })

  return articles
}

const transformArticlesToSearchObjects = async (articles) => {
  const transformed = articles.map(async (article) => {
    const { title, subtitle, image } = article.data

    const excerpt = (
      await remark()
        .use(remarkGfm)
        .use(strip)
        .process(article.content.slice(0, 2500))
    ).value.replace(/\n/g, " ")

    return {
      objectID: article.slug,
      slug: article.slug,
      title,
      subtitle,
      excerpt,
      image,
    }
  })

  return await Promise.all(transformed)
}

;(async function () {
  dotenv.config()
  try {
    const articles = await getAllArticles()
    const transformed = await transformArticlesToSearchObjects(articles)

    const client = algoliasearch(APP_ID, SEARCH_ADMIN_KEY)
    const index = client.initIndex("articles")
    const algoliaResponse = await index.saveObjects(transformed)

    console.log(
      `Successfully indexed ${algoliaResponse.objectIDs.length} records.`,
    )
  } catch (error) {
    console.error(error)
  }
})()
