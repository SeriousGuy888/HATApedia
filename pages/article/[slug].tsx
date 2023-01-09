import { Avatar, CardMedia, Container, Grid, Typography } from "@mui/material"
import MuiMarkdown from "mui-markdown"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import Head from "next/head"
import { Article, getAllArticles, getArticle } from "../../lib/articlesApi"
import NationBanner from "../../modules/NationCard/NationBanner"

interface Props {
  article: Article
}

const ArticlePage: NextPage<Props> = ({ article }) => {
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
            <MuiMarkdown>{article.content}</MuiMarkdown>
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

  return {
    props: {
      article,
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
