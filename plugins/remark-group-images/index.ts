import type { Parent, Paragraph, Content } from "mdast"
import type { Node } from "unist"
import type { Plugin, Transformer } from "unified"
import { visit, SKIP, CONTINUE } from "unist-util-visit"

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

        /*
          Don't consider the node
          if there's anything other than images in it,
          or if there are no images,
          or if there is only one image.
        */
        if (
          filteredChildren.length <= 1 ||
          filteredChildren.some((child) => child.type !== "image")
        ) {
          return SKIP
        }

        // Replace the node with a new one
        const newNode: Content = {
          type: "paragraph",
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
