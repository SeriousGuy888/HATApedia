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
  const realImg = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (loaded) {
      realImg.current?.classList.remove("h-0")
    }
  }, [loaded])

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={"/api/images/blur/" + imgProps.src}

        title={imgProps.title}
        alt={imgProps.alt}
        width={700}
        height={350}
        className={loaded ? "h-0" : ""}

      />
      <Image
        src={"/api/images/" + imgProps.src}
        
        title={imgProps.title}
        alt={imgProps.alt}
        width={700}
        height={350}
        
        className={(imgProps.className ?? "") + loaded ? "" : "h-0"}
        ref={realImg}
        onLoadingComplete={() => setLoaded(true)}
        priority={false}
      />
    </>
  )
}

export default MDXComponents
