import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardMedia,
  Avatar,
} from "@mui/material"
import { NextPage } from "next"
import theme from "../../mui/theme"
import styles from "./NationCard.module.scss"

const NationCard: NextPage<{ nation: { [key: string]: any } }> = ({
  nation,
}) => {
  return (
    <Grid item key={nation.id} xs={12} sm={6}>
      <Card variant="outlined">
        <CardActionArea
          sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}
          href={`./${nation.id}`}
        >
          <CardContent
            sx={{
              flex: "4",
              padding: 3,
              maxWidth: "80%",
            }}
          >
            <Typography variant="h5" className={styles.nowrapText}>
              {nation.name}
            </Typography>
            <Typography
              variant="caption"
              color={theme.palette.text.secondary}
              className={styles.nowrapText}
            >
              {nation.government}
            </Typography>
          </CardContent>
          <CardMedia
            sx={{
              flex: "1",
              borderRadius: 1,
              imageRendering: "pixelated",
            }}
          >
            <Avatar
              src={`/images/banners/${nation.id}.png`}
              sx={{ width: "100%", height: "100%", borderRadius: "inherit" }}
            >
              <img
                src="/images/banners/blank.png"
                style={{ width: "inherit", height: "inherit" }}
              />
            </Avatar>
          </CardMedia>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default NationCard
