import Link from "next/link"
import Image from "next/image"
import NationInfoCard from "./NationInfoCard"
import BookAndQuill from "./BookAndQuill"
import Youtube from "./Youtube"

const MDXComponents = {
  img: (image: HTMLImageElement) => {
    const { src, alt, title, className, width, height } = image

    let imgElem

    if (className?.split(" ").includes("wikilink-image")) {
      imgElem = (
        <Link
          href={src ? "/api/images/" + src : ""}
          target="_blank"
          className="w-full max-w-full flex justify-center overflow-hidden rounded-lg "
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
            className={
              (className ?? "") +
              " rounded-lg m-0 object-cover object-center scale-100 hover:scale-[101%] transition-transform duration-500 ease-in-out"
            }
          />
        </Link>
      )
    } else {
      imgElem = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          title={title ?? ""}
          className={(className ?? "") + " m-0"}
        ></img>
      )
    }

    return imgElem
    // <span>
    //   {imgElem}
    //   {title && (
    //     <span className="text-center text-gray-500 dark:text-gray-400 text-xs m-0">
    //       {title}
    //     </span>
    //   )}
    // </span>
  },
  NationInfoCard,
  BookAndQuill,
  Youtube,
}

export default MDXComponents
