interface MapLocation {
  name: string
  description?: string
  pixelCoords: [number, number]
}

export const cityLocations: { [key: string]: MapLocation } = {
  forgsville: {
    name: "Forgsville",
    pixelCoords: [4355, 5364],
  },
  no: {
    name: "No",
    pixelCoords: [4416, 5363],
  },
}
