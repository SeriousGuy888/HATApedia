import { Paper, Card, CardContent, Typography, Box, useTheme } from "@mui/material"
import { NextPage } from "next"
import NationBanner from "../NationCard/NationBanner"

export interface NationInfoCardData {
  banner?: string
  info: {
    [key: string]: any
  }
}

const NationInfoCard: NextPage<{ nation: NationInfoCardData }> = ({
  nation,
}) => {
  const theme = useTheme()
  
  return (
    <Paper
      elevation={3}
      style={{
        padding: theme.spacing(2),
        marginBottom: theme.spacing(4),
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: theme.spacing(2),
        }}
      >
        <Box style={{ flex: "1" }}>
          <NationBanner src={nation.banner ?? ""} />
        </Box>
        <Box
          style={{
            flex: "4",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            alignContent: "flex-start",
            gap: theme.spacing(2),
          }}
        >
          {nation.info &&
            Object.keys(nation.info).map((key) => (
              <Card style={{ flex: "1", minWidth: "32vmin" }} key={key}>
                <CardContent style={{ textAlign: "center" }}>
                  <Typography color="textSecondary" variant="overline">
                    {key}
                  </Typography>
                  <Typography>{nation?.info[key] ?? "Unknown"}</Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Box>
    </Paper>
  )
}

export default NationInfoCard
