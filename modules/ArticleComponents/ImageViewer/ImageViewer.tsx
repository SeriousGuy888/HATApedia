import { useContext, useEffect } from "react"
import { ImageViewerContext } from "./ImageViewerProvider"
import { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"

const ImageViewer: NextPage = () => {
  const { image, setImage: setImg } = useContext(ImageViewerContext)
  const { src, alt, title, width, height } = image ?? {}

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-90 cursor-zoom-out ${
        image ? "block" : "hidden"
      }`}
      onClick={() => setImg(null)}
    >
      {src && (
        <figure className="absolute inset-0 top-12 md:inset-20 flex flex-col gap-2 justify-center items-center">
          <Image
            src={"/images/content/" + src}
            quality={20}
            width={width ?? 1280}
            height={height ?? 720}
            title={title ?? ""}
            alt={alt ?? "Image"}
            className="md:rounded-md object-contain inset-8 h-auto w-auto max-h-full max-w-full"
          />
          <figcaption className="text-sm">{alt}</figcaption>
          <Link href={"/images/content/" + src} target="_blank" className="text-sm">
            View Original
          </Link>
        </figure>
      )}
    </div>
  )
}

export default ImageViewer
