import { NextApiRequest, NextApiResponse } from "next"
import { getSlugMap } from "../../../lib/articleSlugManager"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const slugMap = await getSlugMap()
  const query = req.query.slug as string

  if (!query) return res.status(400).json([])

  const found = Object.entries(slugMap)
    .filter(([_, fileName]) =>
      fileName.toLowerCase().includes(query.toLowerCase()),
    )
    .map(([slug]) => slug)

  if (found.length) {
    res.status(200).json(found)
  } else {
    res.status(404).json([])
  }
}
