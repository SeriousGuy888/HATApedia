export function getImgWikilinkSrc(imgSrc: string) {
  const wikilinkMatch = imgSrc.match(/^\[\[(.*)\]\]$/)

  if (wikilinkMatch) {
    return "/images/content/" + wikilinkMatch[1]
  }
  return imgSrc
}
