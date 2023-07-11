import fs from "fs/promises"
import path from "path"
import { sluggify } from "../utils/sluggify"

const slugCachePath = path.join(process.cwd(), "cache", "article_slugs.json")
const articlesDir = path.join(process.cwd(), "content", "articles")

let slugMap: Record<string, string> | null = null

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