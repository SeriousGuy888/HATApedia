import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material"
import { NextPage } from "next"
import NationBanner from "../NationCard/NationBanner"

const NationInfoBox: NextPage<{ banner: string }> = ({ banner }) => {
  const theme = useTheme()

  return (
    <Paper
      elevation={12}
      style={{
        padding: theme.spacing(2),
      }}
    >
      <Grid container spacing={2}>
        <Grid item sm={2}>
          <NationBanner src={`/images/banners/${banner}.png`} />
        </Grid>
        <Grid item sm={10}>
          <Typography variant="h4">Billzoplace</Typography>
          <Typography>Information stuff jsoijdfgiog</Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default NationInfoBox
