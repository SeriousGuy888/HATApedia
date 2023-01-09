import { CardMedia, Avatar } from "@mui/material"
import { NextPage } from "next"

const NationBanner: NextPage<{ src: string }> = ({ src }) => {
  return (
    <CardMedia
      sx={{
        flex: "1",
        borderRadius: 1,
        imageRendering: "pixelated",
      }}
    >
      <Avatar
        src={src}
        sx={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      >
        <img
          src="/images/banners/blank.png"
          style={{ width: "inherit", height: "inherit" }}
        />
      </Avatar>
    </CardMedia>
  )
}

export default NationBanner
