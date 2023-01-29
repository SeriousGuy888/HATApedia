import { NextPage } from "next"

const NationBanner: NextPage<{ src: string }> = ({ src }) => {
  return (
    <div
      className="flex-1 min-w-[20%]"
      style={{
        imageRendering: "pixelated",
      }}
    >
      <img
        src={src}
        className="w-full h-full"
        style={{ borderRadius: "inherit" }}
        alt="Banner"
      ></img>
    </div>
  )
}

export default NationBanner