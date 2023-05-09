import type { NextPage } from "next"

const Youtube: NextPage<YoutubeEmbedData> = ({ videoId }) => {
  return (
    <aside className="w-full flex mb-5">
      {/* https://developers.google.com/youtube/player_parameters#Parameters */}
      <iframe
        className="w-full aspect-video print:hidden"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&cc_load_policy=1&cc_lang_pref=en`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      {/* Display a link to the video in print view */}
      <div className="hidden print:block w-full border-solid border-2 border-gray-600 rounded-xl">
        <p className="text-center text-gray-600">
          <strong>Embedded Video:</strong>{" "}
          <a href={`https://www.youtu.be/${videoId}`}>youtu.be/{videoId}</a>
        </p>
      </div>
    </aside>
  )
}

interface YoutubeEmbedData {
  videoId: string
}

export default Youtube
