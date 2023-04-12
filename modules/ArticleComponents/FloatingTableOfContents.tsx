// https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents

import type { NextPage } from "next"
import type { TocNode } from "../../plugins/remark-heading-tree"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
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

function useHighlighted(id: string) {
  const observer = useRef<IntersectionObserver | null>(null)
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0% 0% -40% 0px",
    })

    const elements = document.querySelectorAll("h1,h2,h3,h4,h5,h6")

    elements.forEach((elem) => observer.current?.observe(elem))
    return () => observer.current?.disconnect()
  }, [])

  return [activeId === id, setActiveId] as [boolean, (id: string) => void]
}

function renderNodes(nodes: TocNode[]): ReactNode {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id} className={`${node.depth > 1 ? "" : ""}`}>
          <TocLink node={node} />
          {node.children?.length > 0 && renderNodes(node.children)}
        </li>
      ))}
    </ul>
  )
}

const TocLink: NextPage<{ node: TocNode }> = ({ node }) => {
  const [highlighted, setHighlighted] = useHighlighted(node.id)

  return (
    <p
      className={`text-xs ${
        highlighted && "bg-gray-200 dark:bg-gray-700"
      } w-full py-1`}
      style={{ paddingLeft: `${node.depth - 1}rem` }}
    >
      <Link
        href={`#${node.id}`}
        className={`hover:text-blue-600 dark:hover:text-blue-300`}
        scroll={false}
        onClick={() => setHighlighted(node.id)}
      >
        {node.value}
      </Link>
    </p>
  )
}

export default FloatingTableOfContents
