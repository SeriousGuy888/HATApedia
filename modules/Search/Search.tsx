import { NextPage } from "next"
import { useEffect, useState } from "react"
import ArticleLink from "../ArticleLink/ArticleLink"

const Search: NextPage<{
  active: boolean
  setActive: (_: boolean) => void
}> = ({ active, setActive }) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      fetch(`/api/search/${query}`)
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          setResults(data)
        })
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  if (!active) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-black bg-opacity-50 cursor-pointer"
      onClick={() => setActive(false)}
    >
      <div
        className="bg-gray-200 dark:bg-gray-600 rounded-lg overflow-clip w-96 max-w-prose cursor-default"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
          }}
          autoFocus
          className="w-full p-4 text-lg focus:outline-none"
        />
        <ul className="h-96 overflow-y-auto">
          {results.length ? (
            results.map((r) => {
              return (
                <li key={r} className="p-4">
                  <ArticleLink slug={r} />
                </li>
              )
            })
          ) : (
            <p className="w-full p-4">No results.</p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Search
