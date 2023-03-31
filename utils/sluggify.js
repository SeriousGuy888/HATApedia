function sluggify(fileName) {
  return fileName.toLowerCase().replace(/ /g, "_").replace(/\.md$/, "")
}

module.exports.sluggify = sluggify