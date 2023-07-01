import { NextPage } from "next"
import UIElementError from "../../_UI/UIElementError"
import Image from "next/image"
import { getImgWikilinkSrc } from "../../../lib/wikilinkParser"

const NationInfobox: NextPage<{
  facts?: { [key: string]: any }
  banner?: string
}> = ({ facts, banner }) => {
  if (!facts && !banner) {
    return <UIElementError message="Nation infobox contains no data." />
  }

  if (!facts) {
    facts = {}
  }

  return (
    <aside className="p-6 mb-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-wrap items-start gap-4">
      <Banner src={banner} />
      <div className="flex flex-col content-start flex-[4] gap-2 min-w-[120px]">
        {Object.keys(facts).map((key) => (
          <Fact key={key} title={key} value={facts?.[key]} />
        ))}
      </div>
    </aside>
  )
}

export default NationInfobox

const Banner: NextPage<{ src?: string }> = ({ src }) => {
  const imgSource = src ? getImgWikilinkSrc(src) : "/images/no_banner.png"

  return (
    <div
      className="flex-1 min-w-[80px] aspect-[1/2] relative"
      style={{
        imageRendering: "pixelated",
      }}
    >
      <Image
        src={imgSource}
        alt="Banner"
        className="rounded-md m-0"
        fill
        unoptimized
      />
    </div>
  )
}

const Fact: NextPage<{
  title: string
  value: string
}> = ({ title, value }) => {
  return (
    <section className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md p-4 print:border-b-black print:border-2">
      <div className="px-2 py-1">
        <p className="uppercase text-gray-600 dark:text-gray-300 print:text-black text-xs my-0">
          {title}
        </p>
        <p className="text-md print:text-black my-0">{value ?? "Unknown"}</p>
      </div>
    </section>
  )
}