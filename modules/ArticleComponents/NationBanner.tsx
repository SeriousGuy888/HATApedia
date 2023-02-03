import { NextPage } from "next"
import Image from "next/image"

const NationBanner: NextPage<{ src: string }> = ({ src }) => {
  return (
    <div
      className="flex-1 min-w-[60px] relative aspect-[1/2]"
      style={{
        imageRendering: "pixelated",
      }}
    >
      <Image src={src} alt="Banner" className="rounded-md" fill unoptimized />
    </div>
  )
}

export default NationBanner
