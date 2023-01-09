import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material"
import MuiMarkdown from "mui-markdown"
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from "next"
import Head from "next/head"
import { Article, getAllArticles, getArticle } from "../../lib/articlesApi"
import NationInfoCard from "../../modules/ArticleComponents/NationInfoCard"
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
      <Container maxWidth="md">
        <Typography variant="h3" component="h1">
          {article.title}
        </Typography>
        <Typography variant="overline" color="textSecondary">
          {article.subtitle}
        </Typography>

        <Box my={4}>
          {article.nation && <NationInfoCard nation={article.nation} />}
          <MuiMarkdown
            options={{
              slugify: (str) => str.toLowerCase().replace(/[^a-z]+/g, "-"),
              overrides: {
                h1: {
                  component: "h1",
                },
                h2: {
                  component: "h2",
                },
                h3: {
                  component: "h3",
                },
                h4: {
                  component: "h4",
                },
                h5: {
                  component: "h5",
                },
                h6: {
                  component: "h6",
                },
              },
            }}
          >
            {article.content}
          </MuiMarkdown>
        </Box>
      </Container>
    </>
  )
}

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<GetStaticPropsResult<Props>> {
  const article = getArticle("nations", slug, false)

  return {
    props: {
      article,
    },
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const articles = getAllArticles("nations")

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
