import fs from "fs/promises"
import path from "path"
import { getAllSlugs, getArticleFileContent } from "./articlesApi"
import { unified } from "unified"
import remarkParse from "remark-parse"
import { getOutlinkList } from "../plugins/remark-wikilink-syntax"

const slugCachePath = path.join(process.cwd(), "cache", "article_slugs.json")
const articlesDir = path.join(process.cwd(), "content", "articles")

let slugMap: Record<string, string> | null = null
let backlinksMap: Record<string, string[]> | null = null

/**
 * @throws {Error} If the cache file is not found
 * @throws {Error} If the cache file is not valid JSON
 * @returns A map of slugs to file names
 *          { article_slug: "Article Slug" }
 */
export async function getSlugMap(): Promise<Record<string, string>> {
  if (slugMap) {
    return slugMap
  }

  // ! Can't use this because it's not available in Vercel
  // ! NextJS API routes in Vercel don't have access to files created after deployment

  // test if the cache file exists. if it doesn't, write it and return the result
  // const exists = await fs
  //   .stat(slugCachePath)
  //   .then((stat) => stat.isFile())
  //   .catch(() => false)
  // if (!exists) {
  //   return await writeSlugMap()
  // }

  const data = await fs
    .readFile(slugCachePath, "utf8")
    .then((data) => JSON.parse(data))
    .catch((err) => {
      console.error(err)
      return {}
    })

  slugMap = data
  return data as Record<string, string>
}

/**
 * Loops through all the articles and checks for wikilinks to other articles.
 * Then, it compiles a list, for each article, of the slugs of the articles that link to it.
 *
 * Thus, it allows us to get a list of backlinks for any given article (or not if no backlinks exist).
 *
 * @returns A map of slugs of articles with backlinks to the slugs of articles that link to them.
 */
async function getBacklinksForAllArticles() {
  if (backlinksMap) {
    return backlinksMap
  }

  const allSlugs = await getAllSlugs()

  // map of article slugs to slugs of articles that link to them
  const map: Record<string, string[]> = {}

  for (const slug of allSlugs) {
    const content = await getArticleFileContent(slug)
    if (!content) {
      continue
    }

    const tree = unified().use(remarkParse).parse(content)
    const outlinkList = getOutlinkList(tree)

    for (const linkedSlug of outlinkList) {
      if (!map[linkedSlug]) {
        map[linkedSlug] = []
      }

      if (map[linkedSlug].includes(slug)) {
        continue
      }

      map[linkedSlug].push(slug)
    }
  }

  backlinksMap = map
  return map
}

export async function getBacklinksTo(slug: string) {
  const map = await getBacklinksForAllArticles()
  return map[slug] ?? []
}
