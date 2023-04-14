import Link from "next/link"
import Image from "next/image"
import NationInfoCard from "./NationInfoCard"
import BookAndQuill from "./BookAndQuill"

const MDXComponents = {
  img: (image: HTMLImageElement) => {
    const { src, alt, title, className, width, height } = image

    if (className?.split(" ").includes("wikilink-image")) {
      return (
        <Link
          href={src ? "/api/images/" + src : ""}
          target="_blank"
          className="w-full max-w-full flex justify-center"
        >
          <Image
            src={"/api/images/" + src}
            blurDataURL="/images/loading.png"
            placeholder="blur"
            title={title}
            alt={alt ?? ""}
            width={width}
            height={height}
            className={className ?? ""}
          />
        </Link>
      )
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
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
