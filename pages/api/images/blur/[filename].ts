import { NextApiRequest, NextApiResponse } from "next"
import { getPlaiceholder } from "plaiceholder"

import path from "path"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const fileName = req.query.filename as string
  const filePath = "/" + path.join(fileName)
  const { base64 } = await getPlaiceholder(filePath, {
    dir: "./content/images",
    size: 8,
  })

  const decoded = base64.replace("data:image/png;base64,", "")
  const imageResp = Buffer.from(decoded, "base64")

  res.status(200)
  res.end(imageResp)
}
