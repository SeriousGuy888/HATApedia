import { findAndReplace } from "mdast-util-find-and-replace"
import { Image, Link } from "mdast"
import type { Plugin, Transformer } from "unified"
import { sluggify } from "../../utils/sluggify"
import { slug as githubAnchorSlug } from "github-slugger"
import sizeOf from "image-size"

import type * as mdast from "mdast"

interface Options {
  existingPageNames: string[]
}

const extractLinkElements = (wikilink: string) => {
  // Capture groups:
  //   1. ! at start of link, indicating an image (optional)
  //   2. page name/image name
  //   3. anchor (optional)
  //   4. link text/alt text (optional)
  const captureGroups = /(!)?\[\[([^|#]+)?(?:#([^|#]+))?(?:\|([^|#]+))?\]\]/

  const match = captureGroups.exec(wikilink)
  if (!match) {
    return null
  }

  const isImage = !!match[1]
  const pageName = match[2]

  const headingText = match[3]
  const headingAnchor = githubAnchorSlug(headingText || "")

  let altText = match[4]
  if (!altText) {
    altText = headingText ? `${pageName || ""}#${headingText}` : pageName
  }

  return { isImage, pageName, altText, headingAnchor }
}

const wikilinkSyntax: Plugin<[Options?], mdast.Root> = (
  options: Options = {
    existingPageNames: [],
  },
) => {
  return (tree) => {
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
        if (headingAnchor) {
          console.warn(
            `Heading anchors are not supported for images: ${wikilink}. Ignoring anchor.`,
          )
        }

        const imageSize = sizeOf(`./public/images/content/${pageName}`)

        const imgNode: Image = {
          type: "image",
          url: pageName,
          alt: altText,
          title: altText,
          data: {
            hProperties: {
              className: "wikilink-image",
              width: imageSize.width,
              height: imageSize.height,
            },
          },
        }

        return imgNode
      } else {
        const pageSlug = pageName ? sluggify(pageName) : ""
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
              className:
                // If pageSlug is empty, it means the link is to the current page, so don't make it red.
                // If pageSlug is not empty, check if it's in the list of existing pages,
                // and if it does not exist, then make it red.
                pageSlug && options.existingPageNames.includes(pageSlug)
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
