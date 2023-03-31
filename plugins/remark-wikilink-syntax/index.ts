import { findAndReplace } from "mdast-util-find-and-replace"
import { Image, Link } from "mdast"
import type { Plugin, Transformer } from "unified"

interface Options {
  existingPageNames: string[]
}

const wikilinkSyntax: Plugin<[Options?]> = (
  options: Options = {
    existingPageNames: [],
  },
): Transformer => {
  return async (tree: any) => {
    // regex to find wikilinks
    // [[page name|link text]] or ![[image name|alt text]]
    const linkRegex = /!?\[\[.*?\]\]/g

    findAndReplace(tree, linkRegex, (match: string) => {
      let isImage = false

      // if starts with !, it's an image. remove the !
      if (match.startsWith("!")) {
        isImage = true
        match = match.substring(1)
      }

      // remove the [[ and ]] from the match
      const bracketContent = match.substring(2, match.length - 2)

      // get the [page name/image name] and [link text/alt text]
      let [linkAddress, altText] = bracketContent.split("|")
      if (!altText) {
        altText = linkAddress
      }

      if (isImage) {
        const src = `/images/articles/${linkAddress}`

        const imgNode: Image = {
          type: "image",
          url: src,
          alt: altText,
          title: altText,
        }

        return imgNode
      } else {
        const href = linkAddress.toLowerCase()

        const linkNode: Link = {
          type: "link",
          url: href,
          children: [
            {
              type: "text",
              value: altText,
            },
          ],
          data: {
            hProperties: {
              // make link red if page doesn't exist
              className: options.existingPageNames.includes(href)
                ? ""
                : "redLink",
            },
          },
        }

        return linkNode
      }
    })
  }
}

export default wikilinkSyntax
