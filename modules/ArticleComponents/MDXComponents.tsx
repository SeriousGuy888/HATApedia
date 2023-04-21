import Link from "next/link"
import Image from "next/image"
import NationInfoCard from "./NationInfoCard"
import BookAndQuill from "./BookAndQuill"
import Youtube from "./Youtube"

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
            quality={20}
            title={title}
            alt={alt ?? ""}
            width={width}
            height={height}
            sizes="(min-width: 1280px) 1024px,
            (min-width: 768px) 75vw,
            90vw"
            className={(className ?? "") + " rounded-lg"}
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
  Youtube,
}

export default MDXComponents
