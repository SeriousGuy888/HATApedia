// https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents

import type { NextPage } from "next"
import type { TocNode } from "../../plugins/remark-heading-tree"
import { useEffect, useRef, useState, ReactNode } from "react"
// import { motion } from "framer-motion"
import Link from "next/link"

import ListRoundedIcon from "@mui/icons-material/ListRounded"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"

const FloatingTableOfContents: NextPage<{ nodes: TocNode[] }> = ({ nodes }) => {
  const [isTocOpen, setTocOpen] = useState<boolean>(false)
  const toggleToc = () => {
    setTocOpen((isTocOpen) => !isTocOpen)
  }

  if (!nodes.length) {
    return null
  }

  return (
    <>
      <button
        className="bg-blue-900 p-3 opacity-100 rounded-full fixed right-4 bottom-4 z-40 md:hidden"
        onClick={toggleToc}
        title="Toggle table of contents"
      >
        {isTocOpen ? (
          <CloseRoundedIcon sx={{ color: "white" }} />
        ) : (
          <ListRoundedIcon sx={{ color: "white" }} />
        )}
      </button>
      <span
        className={`fixed left-0 right-0 top-0 bottom-0 bg-black opacity-80 z-20 ${
          isTocOpen ? "block" : "hidden"
        }`}
        onClick={toggleToc}
      />
      <div
        className={`
          fixed bottom-0 
          md:sticky md:top-24 md:bottom-auto 
        
          bg-gray-200 dark:bg-gray-900 shadow-xl
          md:bg-transparent md:dark:bg-transparent 
          
          px-8 py-4 
          md:p-0 

          ${isTocOpen ? "block" : "hidden"}
          md:block
          
          overflow-y-scroll
          md:overflow-y-hidden

          h-full w-full left-0
          max-h-[65%] z-30
        `}
      >
        <div className="flex justify-between align-bottom">
          <h2 className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            Contents
          </h2>
          <Link href="#_top" scroll={false} className="text-xl">
            🔼
          </Link>
        </div>
        <ul>{renderHeadingLinks(nodes)}</ul>
      </div>
    </>
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

function renderHeadingLinks(nodes: TocNode[]): ReactNode {
  return (
    <>
      {nodes.map((node) => (
        <li key={node.id}>
          <TocLink node={node} />
          {node.children?.length > 0 && renderHeadingLinks(node.children)}
        </li>
      ))}
    </>
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
        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
        scroll={false}
        onClick={() => setHighlighted(node.id)}
      >
        {node.value}
      </Link>
    </p>
  )
}

export default FloatingTableOfContents
