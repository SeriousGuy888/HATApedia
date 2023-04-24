import type { NextPage } from "next"

const Youtube: NextPage<YoutubeEmbedData> = ({ videoId }) => {
  return (
    // https://developers.google.com/youtube/player_parameters#Parameters
    <iframe
      className="w-full aspect-video"
      src={`
        https://www.youtube.com/embed/${videoId}
          ?rel=0
          &cc_load_policy=1
          &cc_lang_pref=en
      `}
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
