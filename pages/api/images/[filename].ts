import { NextApiRequest, NextApiResponse } from "next"

import fs from "fs"
import path from "path"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the image name from the query parameters
  const fileName = req.query.filename as string

  // Construct the path to the image file
  const filePath = path.join(process.cwd(), "content", "images", fileName)

  if (!fs.existsSync(filePath)) {
    res.status(404).send("Image not found")
    return
  }

  // Read the image file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Handle error
      res.status(500).send("Internal server error while reading image")
    } else {
      // Set the content type header
      res.setHeader(
        "Content-Type",
        `image/${path.extname(filePath).substring(1)}`,
      )

      // Send the image data as a response
      res.send(data)
    }
  })
}
