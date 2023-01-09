import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { Grid, useTheme } from "@mui/material"
import NationCard from "../modules/NationCard/NationCard"
import { GetStaticPropsResult, NextPage } from "next"
import { ArticlePreview, getAllArticles } from "../lib/articlesApi"

interface Props {
  nations: ArticlePreview[]
}

const Home: NextPage<Props> = ({ nations }) => {
  const theme = useTheme()

  return (
    <Container>
      <Typography variant="h2" color={theme.palette.text.primary}>
        Political Entities
      </Typography>
      <Typography
        variant="subtitle1"
        color={theme.palette.text.secondary}
        gutterBottom
      >
        States and empires on the server
      </Typography>
      <Grid marginY={4} container spacing={2}>
        {nations.map((nation) => (
          <NationCard key={nation.slug} article={nation} />
        ))}
      </Grid>
    </Container>
  )
}

export function getStaticProps(): GetStaticPropsResult<Props> {
  return {
    props: {
      nations: getAllArticles("nations"),
    },
    revalidate: 600,
  }
}

export default Home
