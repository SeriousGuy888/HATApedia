// https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents

import type { Plugin, VFileWithOutput } from "unified"
import type { Root, Heading } from "mdast"
import type { Data } from "unist"
import { visit } from "unist-util-visit"
import GithubSlugger from "github-slugger"
import { toString } from "mdast-util-to-string"

interface HeadingData extends Data {
  hProperties: {
    id: string
  }
}

export interface TocNode {
  value: string
  depth: number
  children: TocNode[]
  id: string
}

const headingTree: Plugin = (): any => {
  return (node: Root, file: VFileWithOutput<string>) => {
    file.data = { headings: getHeadings(node) }
  }
}

function getHeadings(node: Root): TocNode[] {
  const output: TocNode[] = []
  const indexMap: { [key: number]: TocNode } = {}

  const slugger = new GithubSlugger()

  visit(node, "heading", (node: Heading) => {
    addID(node, slugger)
    transformNode(node, output, indexMap)
  })

  return output
}

function addID(node: Heading, slugger: GithubSlugger): void {
  node.data = node.data || {}
  node.data.hProperties = {
    id: slugger.slug((node.children[0] as any)?.value),
  }
}

function transformNode(
  node: Heading,
  output: TocNode[],
  indexMap: { [key: number]: TocNode },
) {
  const transformedNode: TocNode = {
    value: toString(node),
    depth: node.depth,
    id: (node.data as HeadingData).hProperties.id,
    children: [],
  }

  if (node.depth === 1) {
    output.push(transformedNode)
    indexMap[node.depth] = transformedNode
  } else {
    const parent = indexMap[node.depth - 1]
    if (parent) {
      parent.children.push(transformedNode)
      indexMap[node.depth] = transformedNode
    }
  }
}

export default headingTree
