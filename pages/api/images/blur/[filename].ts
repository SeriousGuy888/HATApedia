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
  })

  res.status(200).send(base64)
}
