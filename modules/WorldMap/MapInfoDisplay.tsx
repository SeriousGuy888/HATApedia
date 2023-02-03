import { NextPage } from "next"
import ArticleLink from "../ArticleLink/ArticleLink"
import { MapLocation } from "./map_locations"

const MapInfoDisplay: NextPage<{ marker: MapLocation }> = ({ marker }) => {
  return (
    <aside className="flex-1 lg:max-w-[25%] overflow-auto p-6 bg-inherit">
      <h3 className="text-xl font-bold">{marker.name}</h3>
      <hr className="my-4 border-gray-300 dark:border-gray-600" />
      <p>{marker.description}</p>
      {marker.articles && (
        <div className="mt-8">
          <h3 className="text-lg mb-4">See also...</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {marker.articles?.map((slug) => (
              <ArticleLink key={slug} slug={slug} />
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

export default MapInfoDisplay
