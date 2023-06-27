import Link from "next/link"
import Image from "next/image"
import { NextPage } from "next"

const WikilinkImg: NextPage<HTMLImageElement> = ({
  src,
  alt,
  title,
  className,
  width,
  height,
}) => {
  return (
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
}

export default WikilinkImg
