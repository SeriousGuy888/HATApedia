export function getImgWikilinkSrc(imgSrc: string) {
  if (typeof imgSrc !== "string") {
    console.warn("imgSrc is not a string?????", imgSrc)
    return imgSrc
  }

  const wikilinkMatch = RegExp(/^\[\[(.*)\]\]$/).exec(imgSrc)

  if (wikilinkMatch) {
    return "/images/content/" + wikilinkMatch[1]
  }
  return imgSrc
}
