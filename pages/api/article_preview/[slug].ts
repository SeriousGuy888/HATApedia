import { NextApiRequest, NextApiResponse } from "next"
import { getArticlePreview } from "../../../lib/articlesApi"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const previewData = getArticlePreview(req.query.slug as string)
  if (previewData) {
    res.status(200).json(previewData)
  } else {
    res.status(404).json({})
  }
}
