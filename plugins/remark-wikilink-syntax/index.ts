import { findAndReplace } from "mdast-util-find-and-replace"
import { Image, Link } from "mdast"
import type { Plugin, Transformer } from "unified"
import { sluggify } from "../../utils/sluggify"
import { slug as githubAnchorSlug } from "github-slugger"

interface Options {
  existingPageNames: string[]
}

const extractLinkElements = (wikilink: string) => {
  // Capture groups:
  //   1. ! at start of link, indicating an image (optional)
  //   2. page name/image name
  //   3. anchor (optional)
  //   4. link text/alt text (optional)
  const captureGroups = /(!)?\[\[([\w\s]+)(?:#([\w\s]+))?(?:\|([\w\s]+))?\]\]/

  const match = wikilink.match(captureGroups)
  if (!match) {
    return null
  }

  const isImage = !!match[1]
  const pageName = match[2]

  const headingText = match[3]
  const headingAnchor = githubAnchorSlug(headingText || "")

  let altText = match[4]
  if (!altText) {
    altText = headingText ? `${pageName}#${headingText}` : pageName
  }

  return { isImage, pageName, altText, headingAnchor }
}

const wikilinkSyntax: Plugin<[Options?]> = (
  options: Options = {
    existingPageNames: [],
  },
): Transformer => {
  return async (tree: any) => {
    // regex to find wikilinks
    // Optional exclamation at start + [[something between brackets]]
    const linkRegex = /!?\[\[.*?\]\]/g

    findAndReplace(tree, linkRegex, (wikilink: string) => {
      const linkElems = extractLinkElements(wikilink)
      if (!linkElems) {
        return null
      }
      const { isImage, pageName, altText, headingAnchor } = linkElems

      if (isImage) {
        const src = `/api/images/${pageName}`
        if (headingAnchor) {
          console.warn(
            `Heading anchors are not supported for images: ${wikilink}. Ignoring anchor.`,
          )
        }

        const imgNode: Image = {
          type: "image",
          url: src,
          alt: altText,
          title: altText,
        }

        return imgNode
      } else {
        const pageSlug = sluggify(pageName)
        const href = `${pageSlug}${headingAnchor ? "#" + headingAnchor : ""}`

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
              className: options.existingPageNames.includes(pageSlug)
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
