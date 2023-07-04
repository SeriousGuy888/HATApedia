import { NextPage } from "next"
import Image from "next/image"
import { parse } from "yaml"
import { warnIfExtraKeys } from "./yamlInfoboxUtils"
import { getImgWikilinkSrc } from "../../../lib/wikilinkParser"
import UIElementError from "../../_UI/UIElementError"
import InfoboxFact from "./InfoboxFact"

interface CharacterData {
  name?: string
  facts?: { [key: string]: any }
  image?: string // image for non-player characters and voices in remy's head
  mcUuid?: string // used to get skin
}

const CharacterInfobox: NextPage<{ yaml: string }> = ({ yaml }) => {
  const characterData = parse(yaml) as CharacterData | null

  if (!characterData) {
    return (
      <UIElementError
        message="Character infobox contains no data or invalid data."
        codeBlock={yaml.trim() || "[empty]"}
      />
    )
  }

  // warn if characterData contains extra keys
  warnIfExtraKeys(
    characterData,
    ["name", "facts", "image", "mcUuid"],
    "CharacterInfobox",
  )

  const { name, image, mcUuid } = characterData
  let facts = characterData.facts ?? {}

  return (
    <aside className="my-12">
      <section className="bg-blue-200 dark:bg-blue-900 mb-0 px-6 py-4 rounded-t-lg">
        <p className="m-0 text-black dark:text-white font-bold">{name}</p>
      </section>
      <section
        className={`p-6 bg-slate-100 dark:bg-slate-800 flex flex-col ${
          name ? "rounded-b-lg" : "rounded-lg"
        }`}
      >
        {image && (
          <figure className="flex-1 m-0 mb-8 w-full">
            <Image
              src={getImgWikilinkSrc(image)}
              alt={"Image of " + name}
              width={256}
              height={256}
              className="rounded-xl w-full"
            />
          </figure>
        )}
        <div className="flex flex-wrap items-start gap-8">
          {mcUuid && (
            /* eslint-disable @next/next/no-img-element */
            <img
              src={`https://crafatar.com/renders/body/${mcUuid}?scale=4`}
              alt="Minecraft skin"
              className="flex-1 m-0"
            />
          )}
          <div className="flex flex-col content-start flex-[4] gap-2 min-w-[120px]">
            {Object.keys(facts).map((key) => (
              <InfoboxFact key={key} title={key} value={facts?.[key]} />
            ))}
          </div>
        </div>
      </section>
    </aside>
  )
}

export default CharacterInfobox
