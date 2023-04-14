import Link from "next/link"
import Image from "next/image"
import NationInfoCard from "./NationInfoCard"
import BookAndQuill from "./BookAndQuill"

const MDXComponents = {
  img: (image: {
    src?: string
    alt?: string
    title?: string
    className?: string
  }) => {
    const { src, alt, title, className } = image

    if (className?.split(" ").includes("wikilink-image")) {
      return (
        <Link href={src ? "/api/images/" + src : ""} target="_blank">
          <Image
            src={"/api/images/" + src}
            blurDataURL={"/api/images/blur/" + src}
            placeholder="blur"
            title={title}
            alt={alt ?? ""}
            width={700}
            height={350}
            className={className ?? ""}
          />
        </Link>
      )
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src ?? ""}
        alt={alt ?? ""}
        title={title ?? ""}
        className={className ?? ""}
      ></img>
    )
  },
  NationInfoCard,
  BookAndQuill,
}

export default MDXComponents
