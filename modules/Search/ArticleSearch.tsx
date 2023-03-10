import algoliasearch from "algoliasearch"
import { NextPage } from "next"
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  Snippet,
} from "react-instantsearch-hooks-web"
import ArticleLink from "../ArticleLink/ArticleLink"
import LinkCard from "./LinkCard"

const SearchBar = () => {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "",
    process.env.NEXT_PUBLIC_SEARCH_KEY ?? "",
  )

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="articles"
      routing={true}
    >
      <Configure hitsPerPage={6} attributesToSnippet={["excerpt"]} />
      <SearchBox
        placeholder="Search"
        className="w-full border-b-blue-500 border-b-2"
        classNames={{
          form: "w-full",
          input: "w-full bg-transparent focus:outline-none p-2",
          resetIcon: "hidden",
          submitIcon: "hidden",
        }}
      />
      <div>
        <Pagination
          classNames={{
            root: "mt-8 select-none flex justify-center",
            list: "flex gap-1",
            item: "rounded-2xl w-8 h-8 text-center text-white flex items-center [&>*]:flex-1",
            selectedItem: "bg-blue-500",
            disabledItem: "opacity-50",
            previousPageItem: "mr-4",
            nextPageItem: "ml-4",
          }}
        />
        <Hits
          hitComponent={Hit}
          className="mt-4"
          classNames={{
            list: "grid grid-cols-1 md:grid-cols-2 gap-4",
            item: "h-full",
          }}
        />
      </div>
    </InstantSearch>
  )
}

const Hit: NextPage<{ hit: any }> = ({ hit }) => {
  console.log(hit)
  return (
    <div className="h-full flex flex-col [&>*]:flex-1">
      <LinkCard
        title={hit.title}
        subtitle={hit.subtitle}
        description={<Snippet hit={hit} attribute="excerpt" />}
        link={`/articles/${hit.slug}`}
        imageSrc={hit.image}
      />
    </div>
  )
}

export default SearchBar