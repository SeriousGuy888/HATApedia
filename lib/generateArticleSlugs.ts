import fs from "fs/promises"
import path from "path"
import { sluggify } from "../utils/sluggify"

export const slugsFile = path.join(process.cwd(), "cache", "articleSlugs.json")

export async function generateArticleSlugs() {
  const articlesDir = path.join(process.cwd(), "/content/articles/")

  const filenames = await fs.readdir(articlesDir)

  let slugs: { [slug: string]: string } = {}
  for (const filename of filenames) {
    const slug = sluggify(filename)
    slugs[slug] = filename
  }

  warnIfDuplicateSlugs(Object.keys(slugs))
  await fs.writeFile(slugsFile, JSON.stringify(slugs))

  return slugs
}

function warnIfDuplicateSlugs(slugs: string[]) {
  const uniqueSlugs = new Set(slugs)
  if (uniqueSlugs.size !== slugs.length) {
    console.warn("Warning: Duplicate article slugs found!")
  }
}
