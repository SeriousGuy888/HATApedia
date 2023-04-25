import fs from "fs/promises"
import path from "path"
import { sluggify } from "../utils/sluggify"

const slugsFile = path.join(process.cwd(), "cache", "articleSlugs.json")
const articlesDir = path.join(process.cwd(), "/content/articles/")

async function generateArticleSlugs() {
  const filenames = await fs.readdir(articlesDir)

  let slugs: { [slug: string]: string } = {}
  for (const filename of filenames) {
    const slug = sluggify(filename)
    slugs[slug] = filename
  }

  warnIfDuplicateSlugs(Object.keys(slugs))

  try {
    fs.mkdir(path.dirname(slugsFile), { recursive: true })
  } catch (e) {
    // ignore error if directory already exists
  }

  await fs.writeFile(slugsFile, JSON.stringify(slugs))
  
  console.log(
    `Successfully wrote ${
      Object.keys(slugs).length
    } article slugs to ${slugsFile}.`,
  )

  return slugs
}

function warnIfDuplicateSlugs(slugs: string[]) {
  const uniqueSlugs = new Set(slugs)
  if (uniqueSlugs.size !== slugs.length) {
    console.warn("Warning: Duplicate article slugs found!")
  }
}

generateArticleSlugs()
