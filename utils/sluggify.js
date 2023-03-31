export function sluggify(fileName) {
  return fileName.toLowerCase().replace(/ /g, "_").replace(/\.md$/, "")
}
