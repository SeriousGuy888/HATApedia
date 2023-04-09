import Link from "next/link"
import Image from "next/image"
import NationInfoCard from "./NationInfoCard"

const MDXComponents = {
  img: (image: {
    src?: string
    alt?: string
    title?: string
    className?: string
  }) => {
    if (image.className?.split(" ").includes("wikilink-image")) {
      return (
        <Link href={image.src ?? ""} target="_blank">
          <Image
            src={image.src ?? ""}
            alt={image.alt ?? ""}
            title={image.title ?? ""}
            width={700}
            height={350}
          />
        </Link>
      )
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src ?? ""}
        alt={image.alt ?? ""}
        title={image.title ?? ""}
        className={image.className ?? ""}
      ></img>
    )
  },
  NationInfoCard,
}

export default MDXComponents
