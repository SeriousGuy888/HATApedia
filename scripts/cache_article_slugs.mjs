import fs from "fs"
import path from "path"
import { sluggify } from "../utils/sluggify.js"

const slugsFile = path.join(process.cwd(), "cache", "article_slugs.json")
const articlesDir = path.join(process.cwd(), "/content/articles/")

generateArticleSlugs()

function generateArticleSlugs() {
  const filenames = fs.readdirSync(articlesDir)

  let slugs = {}
  for (const filename of filenames) {
    const slug = sluggify(filename)
    slugs[slug] = filename
  }

  warnIfDuplicateSlugs(Object.keys(slugs))

  try {
    fs.mkdirSync(path.dirname(slugsFile), { recursive: true })
  } catch (e) {
    // ignore error if directory already exists
  }

  fs.writeFileSync(slugsFile, JSON.stringify(slugs))

  console.log(
    `Successfully wrote ${
      Object.keys(slugs).length
    } article slugs to ${slugsFile}.`,
  )

  return slugs
}

function warnIfDuplicateSlugs(slugs) {
  const uniqueSlugs = new Set(slugs)
  if (uniqueSlugs.size !== slugs.length) {
    console.warn("Warning: Duplicate article slugs found!")
  }
}
