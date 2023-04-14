import Link from "next/link"
import Image, { ImageProps } from "next/image"
import NationInfoCard from "./NationInfoCard"
import BookAndQuill from "./BookAndQuill"
import { useEffect, useRef, useState } from "react"

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
          <BlurredImage
            src={image.src ?? ""}
            alt={image.alt ?? ""}
            title={title ?? ""}
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

const BlurredImage = (imgProps: ImageProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      src={"/api/images/" + imgProps.src}
      blurDataURL={"/api/images/blur/" + imgProps.src}
      placeholder="blur"
      title={imgProps.title}
      alt={imgProps.alt}
      width={700}
      height={350}
      className={imgProps.className ?? ""}
      onLoadingComplete={() => setLoaded(true)}
      style={{ filter: loaded ? "" : "blur(10px)" }}
    />
  )
}

export default MDXComponents
