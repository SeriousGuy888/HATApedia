import path from "path"
import express from "express"

export const config = {
  api: { externalResolver: true },
}

// Construct the path to the image file
const filePath = path.join(process.cwd(), "content", "images")
const serveFiles = express.static(filePath, {
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days cache
})

const handler = express()
handler.use(["/api/images"], serveFiles)

export default handler