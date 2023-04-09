import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"
import { getAllSlugs, getArticleFileContent } from "./articlesApi"

import remarkGfm from "remark-gfm"
import remarkWikilink from "../plugins/remark-wikilink-syntax"
import remarkToc from "remark-toc"
import remarkParse from "remark-parse"
import remarkHtml from "remark-html"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeFormat from "rehype-format"
import rehypeStringify from "rehype-stringify"
import rehypeWrap from "rehype-wrap-all"

export async function getFileBySlug(slug: string) {
  const source = await getArticleFileContent(slug)
  if (!source) {
    return null
  }

  const allSlugs = await getAllSlugs()

  const { content, data } = matter(source)
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkParse,
        remarkGfm,
        [remarkWikilink, { existingPageNames: allSlugs }],
        [remarkToc, { tight: true }],
        remarkHtml,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        [
          rehypeWrap,
          {
            selector: "table",
            wrapper: `div.responsive-table`,
          },
        ],
        rehypeFormat,
        rehypeStringify,
      ],
    },
    scope: data,
  })

  return {
    mdxSource,
    frontMatter: {
      ...data,
      slug,
    },
  }
}
