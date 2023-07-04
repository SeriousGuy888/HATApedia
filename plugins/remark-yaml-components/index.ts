import { visit } from "unist-util-visit"
import type * as mdast from "mdast"
import type * as unified from "unified"

interface Options {
  /**
   * the key is the language name to use in the code block
   * the value is the JSX component name it will be converted to
   *
   * @example
   *  "infobox-nation": "NationInfobox"
   *
   * ```infobox-nation... -> <NationInfobox ... />
   */
  conversionMap: {
    [key: string]: string
  }
}

// based on https://github.com/kevinzunigacuellar/remark-code-title/blob/main/packages/remark-code-title/src/remarkPlugin.ts
const convertYamlCodeblocks: unified.Plugin<[Options?], mdast.Root> = (
  options,
) => {
  if (
    !options?.conversionMap ||
    Object.keys(options.conversionMap).length === 0
  ) {
    throw new Error(
      "No options provided to remark-yaml-components. Specify a conversionMap with at least one entry.",
    )
  }

  const { conversionMap } = options

  return (tree, file) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || index === null) {
        return
      }

      const lang = node.lang
      if (!lang || conversionMap[lang] === undefined) {
        return
      }

      const jsxNode: mdast.HTML = {
        type: "html",
        data: {
          hName: conversionMap[lang],
          hProperties: {
            yaml: node.value,
          },
        },
        value: node.value,
      }

      parent.children[index] = jsxNode
    })
  }
}

export default convertYamlCodeblocks
