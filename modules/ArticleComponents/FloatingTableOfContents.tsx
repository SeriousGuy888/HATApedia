import type { NextPage } from "next"
import type { ReactNode } from "react"
import type { TocNode } from "../../plugins/remark-heading-tree"
import Link from "next/link"

const FloatingTableOfContents: NextPage<{ nodes: TocNode[] }> = ({ nodes }) => {
  if (!nodes.length) {
    return null
  }

  return (
    <div className="sticky top-4 h-fit w-full left-0 hidden md:block">
      <h2 className="text-lg text-gray-500 mb-4">Table of Contents</h2>
      {renderNodes(nodes)}
    </div>
  )
}

function renderNodes(nodes: TocNode[]): ReactNode {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id} className={`${node.depth > 1 ? "ml-4" : ""}`}>
          <TocLink node={node} />
          {node.children?.length > 0 && renderNodes(node.children)}
        </li>
      ))}
    </ul>
  )
}

const TocLink: NextPage<{ node: TocNode }> = ({ node }) => {
  return (
    <Link
      href={`#${node.id}`}
      className={`${
        node.depth === 1 ? "text-sm" : "text-xs"
      } hover:text-blue-500`}
    >
      {node.value}
    </Link>
  )
}

export default FloatingTableOfContents
