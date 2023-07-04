import { NextPage } from "next"
import UIElementError from "../../_UI/UIElementError"
import Image from "next/image"
import { getImgWikilinkSrc } from "../../../lib/wikilinkParser"
import { parse } from "yaml"

interface Props {
  yaml: string
}

interface InfoboxData {
  name?: string
  facts?: { [key: string]: any }
  banner?: string
}

const NationInfobox: NextPage<Props> = ({ yaml }) => {
  const infoboxData = parse(yaml) as InfoboxData | null

  // warn if infoboxData contains extra keys
  const allowedKeys = ["name", "facts", "banner"]
  const extraKeys = Object.keys(infoboxData ?? {}).filter(
    (key) => !allowedKeys.includes(key),
  )
  if (extraKeys.length > 0) {
    console.warn(`NationInfobox contains extra keys: ${extraKeys.join(", ")}`)
  }
  // end warn

  if (!infoboxData || (!infoboxData?.facts && !infoboxData?.banner)) {
    return (
      <UIElementError
        message="Nation infobox contains no data or invalid data."
        codeBlock={yaml.trim() || "[empty]"}
      />
    )
  }

  let { name, facts, banner } = infoboxData

  if (!facts) {
    facts = {}
  }

  return (
    <aside className="">
      {name && (
        <section className="bg-blue-200 dark:bg-blue-900 mb-0 px-6 py-4 rounded-t-lg">
          <p className="m-0 text-black dark:text-white">
            About <span className="font-bold">{name}</span>
          </p>
        </section>
      )}
      <section
        className={`p-6 mb-16 bg-slate-100 dark:bg-slate-800 ${
          name ? "rounded-b-lg" : "rounded-lg"
        } flex flex-wrap items-start gap-4`}
      >
        <Banner src={banner} />
        <div className="flex flex-col content-start flex-[4] gap-2 min-w-[120px]">
          {Object.keys(facts).map((key) => (
            <Fact key={key} title={key} value={facts?.[key]} />
          ))}
        </div>
      </section>
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
        <p className="text-md text-black dark:text-white print:text-black my-0">
          {value ?? "Unknown"}
        </p>
      </div>
    </section>
  )
}
