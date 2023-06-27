import dynamic from "next/dynamic"

const MDXComponents = {
  img: (image: HTMLImageElement) => {
    const { src, alt, title, className } = image

    let imgElem

    if (className?.split(" ").includes("wikilink-image")) {
      const WikilinkImg = dynamic(() => import("./WikilinkImg"))
      imgElem = <WikilinkImg {...image} />
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
  },
  NationInfoCard: dynamic(() => import("./NationInfoCard")),
  BookAndQuill: dynamic(() => import("./BookAndQuill")),
  Youtube: dynamic(() => import("./Youtube")),
}

export default MDXComponents
