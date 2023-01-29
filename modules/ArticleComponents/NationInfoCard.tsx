import { NextPage } from "next"
import NationBanner from "../NationCard/NationBanner"

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
    <div className="p-8 mb-16 bg-gray-100 rounded-xl">
      <section className="flex flex-wrap justify-between items-stretch gap-8">
        <div className="flex-1">
          <NationBanner src={nation.banner ?? ""} />
        </div>
        <div className="flex flex-wrap items-baseline content-start flex-[4] gap-4 min-w-[200px]">
          {nation.info &&
            Object.keys(nation.info).map((key) => (
              <div className="flex-1 bg-gray-200 rounded-md p-4" key={key}>
                <div className="text-center">
                  <p className="uppercase text-gray-600 text-sm">{key}</p>
                  <p className="text-lg">{nation?.info[key] ?? "Unknown"}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

export default NationInfoCard
