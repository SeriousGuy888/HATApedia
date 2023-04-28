import type { Parent, Paragraph, Content } from "mdast"
import type { Node } from "unist"
import type { Plugin, Transformer } from "unified"
import { visit, SKIP } from "unist-util-visit"

const wikilinkSyntax: Plugin = (): Transformer => {
  return (tree: Node) => {
    visit(
      tree,
      "paragraph",
      // https://github.com/syntax-tree/unist-util-visit#visitor
      (paragraph: Paragraph, index: number, parent: Parent) => {
        const { children } = paragraph

        // Remove any empty text nodes between images
        const filteredChildren = children.filter((child) => {
          if (child.type === "image") return true
          if (child.type === "text") return child.value.trim() !== ""
        })

        // Don't consider the node if there's anything other than images in it.
        if (filteredChildren.some((child) => child.type !== "image")) {
          return
        }

        // don't wrap images in a gallery if there's only one image
        if (filteredChildren.length <= 1) {
          // still take the image out of the p tag, since itll be wrapped in a figure tag later
          parent.children.splice(index, 1, ...filteredChildren)
          return SKIP
        }

        // Replace the node with a new one
        const newNode: Content = {
          type: "tableCell" /*  this is a hack; tablecell becomes a div
                                im not allowed to use a p tag,
                                since <figure>s are not allowed inside p tags */,
          children: filteredChildren,
          data: {
            hProperties: {
              className: "gallery",
            },
          },
        }

        parent.children.splice(index, 1, newNode)
        return SKIP
      },
    )

    return tree
  }
}

export default wikilinkSyntax
