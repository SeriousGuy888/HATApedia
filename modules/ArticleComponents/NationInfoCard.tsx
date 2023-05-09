import { NextPage } from "next"
import NationBanner from "./NationBanner"
import { getImgWikilinkSrc } from "../../lib/wikilinkParser"

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
    <div className="p-6 mb-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-wrap items-start gap-4">
      <NationBanner
        src={
          nation.banner
            ? getImgWikilinkSrc(nation.banner)
            : "/images/no_banner.png"
        }
      />
      <div className="flex flex-col content-start flex-[4] gap-2 min-w-[120px]">
        {nation.info &&
          Object.keys(nation.info).map((key) => (
            <div
              className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md p-4 print:border-b-black print:border-2"
              key={key}
            >
              <div className="px-2 py-1">
                <p className="uppercase text-gray-600 dark:text-gray-300 print:text-black text-xs">
                  {key}
                </p>
                <p className="text-md print:text-black">
                  {nation?.info[key] ?? "Unknown"}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default NationInfoCard
