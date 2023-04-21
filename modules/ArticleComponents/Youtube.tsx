import type { NextPage } from "next"

const Youtube: NextPage<YoutubeEmbedData> = ({ videoId }) => {
  return (
    <iframe
      className="w-full aspect-video"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  )
}

interface YoutubeEmbedData {
  videoId: string
}

export default Youtube
