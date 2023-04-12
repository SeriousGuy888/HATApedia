import type { NextPage } from "next"
import type { ReactNode } from "react"
import type { TocNode } from "../../plugins/remark-heading-tree"
import Link from "next/link"

const FloatingTableOfContents: NextPage<{ nodes: TocNode[] }> = ({ nodes }) => {
  if (!nodes.length) {
    return null
  }

  return (
    <div className="sticky top-12 h-fit w-full left-0 hidden md:block">
      <div className="flex justify-between align-bottom">
        <h2 className="text-lg text-gray-500 dark:text-gray-400 mb-4">
          Contents
        </h2>
        <Link href="#_top" scroll={false} className="text-xl">
          🔼
        </Link>
      </div>
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
      } hover:text-blue-600 dark:hover:text-blue-300`}
      scroll={false}
    >
      {node.value}
    </Link>
  )
}

export default FloatingTableOfContents
