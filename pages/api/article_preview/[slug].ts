import { NextApiRequest, NextApiResponse } from "next"
import { getArticle } from "../../../lib/articlesApi"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const previewData = getArticle(req.query.slug as string, true)
  if (previewData) {
    res.status(200).json(previewData)
  } else {
    res.status(404).json({})
  }
}
