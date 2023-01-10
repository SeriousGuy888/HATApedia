import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material"
import { NextPage } from "next"
import { ArticlePreview } from "../../lib/articlesApi"
import theme from "../../mui/theme"
import NationBanner from "./NationBanner"
import styles from "./NationCard.module.scss"

const NationCard: NextPage<{ article: ArticlePreview }> = ({ article }) => {
  return (
    <Grid item xs={12} sm={6}>
      <Card variant="outlined">
        <CardActionArea
          sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}
          href={`./article/${article.slug}`}
        >
          <CardContent
            sx={{
              flex: "4",
              padding: 3,
              maxWidth: "80%",
            }}
          >
            <Typography variant="h5" className={styles.nowrapText}>
              {article.title}
            </Typography>
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              className={styles.nowrapText}
            >
              {article.subtitle}
            </Typography>
          </CardContent>
          <NationBanner src={article.image ?? ""} />
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default NationCard
