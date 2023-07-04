import { visit } from "unist-util-visit"
import type * as mdast from "mdast"
import type * as unified from "unified"

// based on https://github.com/kevinzunigacuellar/remark-code-title/blob/main/packages/remark-code-title/src/remarkPlugin.ts

const convert: unified.Plugin<[], mdast.Root> = () => {
  return (tree, file) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || index === null) {
        return
      }

      console.log(node)

      if (node.lang === "infobox-nation") {
        const jsxNode: mdast.HTML = {
          type: "html",
          data: {
            hName: "NationInfobox",
            hProperties: {
              yaml: node.value,
            },
          },
          value: node.value,
        }

        parent.children[index] = jsxNode
      }
    })
  }
}

export default convert
