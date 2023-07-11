import fs from "fs/promises"
import path from "path"
import { sluggify } from "../utils/sluggify"

const slugCachePath = path.join(process.cwd(), "cache", "article_slugs.json")
const articlesDir = path.join(process.cwd(), "content", "articles")

/**
 * @throws {Error} If the cache file is not found
 * @throws {Error} If the cache file is not valid JSON
 * @returns A map of slugs to file names
 *          { article_slug: "Article Slug" }
 */
export async function getSlugMap(): Promise<Record<string, string>> {
  // test if the cache file exists. if it doesn't, write it and return the result
  const exists = await fs
    .stat(slugCachePath)
    .then((stat) => stat.isFile())
    .catch(() => false)
  if (!exists) {
    return await writeSlugMap()
  }

  const data = await fs
    .readFile(slugCachePath, "utf8")
    .then((data) => JSON.parse(data))
    .catch((err) => {
      console.error(err)
      return {}
    })

  return data as Record<string, string>
}

/**
 * Gathers all the article files in the articles directory, takes their file names,
 * converts them to slugs, and writes them to a cache file.
 *
 * If there different files whose slugs are the same, a warning is printed to the console.
 *
 * @returns A map of slugs to file names that was just written to the cache file
 */
async function writeSlugMap() {
  const filenames = await fs.readdir(articlesDir)

  let slugMap: Record<string, string> = {}
  for (const filename of filenames) {
    const slug = sluggify(filename)
    slugMap[slug] = filename
  }

  warnIfDuplicateSlugs(Object.keys(slugMap))

  fs.mkdir(path.dirname(slugCachePath), { recursive: true }).catch((_) => {}) // ignore if the directory already exists
  await fs.writeFile(slugCachePath, JSON.stringify(slugMap))

  console.log(
    `Successfully wrote ${
      Object.keys(slugMap).length
    } article slugs to ${slugCachePath}.`,
  )

  return slugMap
}

function warnIfDuplicateSlugs(slugs: string[]) {
  const uniqueSlugs = new Set(slugs)
  if (uniqueSlugs.size !== slugs.length) {
    console.warn("Warning: Duplicate article slugs found!")
  }
}
