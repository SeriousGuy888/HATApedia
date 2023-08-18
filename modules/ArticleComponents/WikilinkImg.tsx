import Image from "next/image"
import { NextPage } from "next"
import { useContext } from "react"
import { ImageViewerContext } from "./ImageViewer/ImageViewerProvider"

const WikilinkImg: NextPage<HTMLImageElement> = (imageData) => {
  const { src, alt, title, className, width, height } = imageData

  const context = useContext(ImageViewerContext)

  return (
    <Image
      src={"/images/content/" + src}
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
      className={
        (className ?? "") +
        " rounded-lg m-0 object-cover object-center scale-100 hover:scale-[101%] transition-transform duration-500 ease-in-out cursor-pointer"
      }
      onClick={() => {
        context.setImage(imageData)
      }}
    />
  )
}

export default WikilinkImg
