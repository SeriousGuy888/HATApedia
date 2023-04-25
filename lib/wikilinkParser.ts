export function getImgWikilinkSrc(imgSrc: string) {
  const wikilinkMatch = imgSrc.match(/^\[\[(.*)\]\]$/)

  if (wikilinkMatch) {
    return "/api/images/" + wikilinkMatch[1]
  }
  return imgSrc
}
