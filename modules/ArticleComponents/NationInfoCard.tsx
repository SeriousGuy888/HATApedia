import { NextPage } from "next"
import NationBanner from "./NationBanner"

export interface NationInfoCardData {
  banner?: string
  info: {
    [key: string]: any
  }
}

const NationInfoCard: NextPage<{ nation: NationInfoCardData }> = ({
  nation,
}) => {
  return (
    <div className="p-6 mb-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <section className="flex flex-wrap justify-between items-stretch gap-4">
        <NationBanner src={nation.banner ?? ""} />
        <div className="flex flex-col items-stretch content-start flex-[4] gap-2 min-w-[150px]">
          {nation.info &&
            Object.keys(nation.info).map((key) => (
              <div
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md p-4"
                key={key}
              >
                <div className="px-2 py-1">
                  <p className="uppercase text-gray-600 dark:text-gray-300 text-xs">
                    {key}
                  </p>
                  <p className="text-md">{nation?.info[key] ?? "Unknown"}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

export default NationInfoCard
