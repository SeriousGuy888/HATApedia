import { Container, Grid, Typography } from "@mui/material"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import Head from "next/head"
import { Article, getAllArticles, getArticle } from "../../lib/articlesApi"
import NationBanner from "../../modules/NationCard/NationBanner"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import remarkGfm from "remark-gfm"
import NationInfoBox from "../../modules/Articles/NationInfoBox"

interface Props {
  article: Article
  source: MDXRemoteSerializeResult
}

const ArticlePage: NextPage<Props> = ({ article, source }) => {
  return (
    <>
      <Head>
        <title>{`${article.title} - HATApedia`}</title>
      </Head>
      <Container>
        <Typography variant="h3" component="h1">
          {article.title}
        </Typography>
        <Typography variant="overline" color="textSecondary">
          {article.subtitle}
        </Typography>
        <Grid marginY={4} container spacing={4}>
          <Grid item xs={12} md={9}>
            <MDXRemote
              {...source}
              components={{ NationInfoBox }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <NationBanner src={article.image ?? ""} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<GetStaticPropsResult<Props>> {
  const article = getArticle(slug, false)
  const mdxSource = await serialize(article.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  })

  return {
    props: {
      article,
      source: mdxSource,
    },
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const articles = getAllArticles()

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: false,
  }
}

export default ArticlePage
