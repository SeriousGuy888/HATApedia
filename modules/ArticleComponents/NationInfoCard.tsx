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
  return (
    <div
      style={{
        padding: "2rem",
        marginBottom: "4rem",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "2rem",
        }}
      >
        <div style={{ flex: "1" }}>
          <NationBanner src={nation.banner ?? ""} />
        </div>
        <div
          style={{
            flex: "4",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            alignContent: "flex-start",
            gap: "2rem",
          }}
        >
          {nation.info &&
            Object.keys(nation.info).map((key) => (
              <div style={{ flex: "1", minWidth: "32vmin" }} key={key}>
                <div style={{ textAlign: "center" }}>
                  <p>{key}</p>
                  <p>{nation?.info[key] ?? "Unknown"}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

export default NationInfoCard
