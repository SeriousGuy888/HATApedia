function sluggify(fileName) {
  return fileName.toLowerCase().replace(/ /g, "_").replace(/\.mdx?$/, "")
}

module.exports.sluggify = sluggify