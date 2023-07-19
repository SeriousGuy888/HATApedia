import type { Plugin } from "unified"
import { findAndReplace } from "mdast-util-find-and-replace"
import { visit } from "unist-util-visit"
import { Image, Link, Root, Text } from "mdast"
import { sluggify } from "../../utils/sluggify"
import { slug as githubAnchorSlug } from "github-slugger"
import sizeOf from "image-size"

interface Options {
  existingPageNames: string[]
}

/**
 * regex to find wikilinks
 * Optional exclamation at start + [[something between brackets]]
 */
const wikilinkRegex = /!?\[\[.*?\]\]/g

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

const wikilinkSyntax: Plugin<[Options?], Root> = (
  options: Options = {
    existingPageNames: [],
  },
) => {
  return (tree, file) => {
    findAndReplace(tree, wikilinkRegex, (matchedStr: string) => {
      const linkElems = extractLinkElements(matchedStr)
      if (!linkElems) {
        return null
      }

      const { isImage, pageName, altText, headingAnchor } = linkElems

      if (isImage) {
        return getImageNode(matchedStr, pageName, altText, headingAnchor)
      } else {
        return getLinkNode(
          pageName,
          altText,
          headingAnchor,
          options.existingPageNames,
        )
      }
    })
  }
}

export default wikilinkSyntax

function getImageNode(
  wikilink: string,
  fileName: string,
  altText: string,
  headingAnchor: string,
): Image {
  if (headingAnchor) {
    console.warn(
      `Heading anchors are not supported for images: ${wikilink}. Ignoring anchor.`,
    )
  }

  const imageSize = sizeOf(`./public/images/content/${fileName}`)

  const imgNode: Image = {
    type: "image",
    url: fileName,
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
}

function getLinkNode(
  pageName: string,
  altText: string,
  headingAnchor: string,
  existingPageNames: string[],
): Link {
  const pageSlug: string = pageName ? sluggify(pageName) : ""
  const href = `${pageSlug}${headingAnchor ? "#" + headingAnchor : ""}`

  // If pageSlug is empty, it means the link is to the current page, so don't make it red.
  // If pageSlug is not empty, check if it's in the list of existing pages,
  // and if it does not exist, then make it red.
  let isRedLink = false
  if (pageSlug && !existingPageNames.includes(pageSlug)) {
    isRedLink = true
  }

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
        className: isRedLink ? "redLink" : "",
      },
    },
  }

  return linkNode
}

/**
 * Get an array of all the slugs to which there are wikilinks to
 * in the given tree (article content)
 */
export function getOutlinkList(tree: Root) {
  // set of all slugs to which there are wikilinks to
  const outlinks = new Set<string>()
  
  // loop through the tree and find all wikilinks in text nodes, and add them to the list of outlinks
  visit(tree, "text", testForWikilink)

  function testForWikilink(node: Text) {
    const matches = node.value.match(wikilinkRegex)

    if (matches) {
      matches.forEach((match) => {
        const linkElems = extractLinkElements(match)
        if (!linkElems || linkElems.isImage) {
          return
        }

        const { pageName } = linkElems
        if (pageName) {
          outlinks.add(sluggify(pageName))
        }
      })
    }
  }

  return Array.from(outlinks)
}
