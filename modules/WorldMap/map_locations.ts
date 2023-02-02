interface MapLocation {
  name: string
  description?: string
  pixelCoords: [number, number]
}

export const cityLocations: { [key: string]: MapLocation } = {
  spawn: {
    name: "Spawn",
    pixelCoords: [4442, 4812],
  },
  un: {
    name: "United Nations HQ",
    pixelCoords: [4554, 4762],
  },
  billzoplace: {
    name: "Billzoplace",
    pixelCoords: [4157, 4960],
  },
  forgsville: {
    name: "Forgsville",
    pixelCoords: [4355, 5364],
  },
  no: {
    name: "No",
    pixelCoords: [4416, 5363],
  },
  scammington: {
    name: "Scammington",
    pixelCoords: [4312, 5264],
  },
  hawainot: {
    name: "Hawainot",
    pixelCoords: [4020, 5265],
  },
  new_mangrovia: {
    name: "New Mangrovia",
    description: "Formerly known as Remyan Mangrovia",
    pixelCoords: [4282, 4869],
  },
  remy_jungle: {
    name: "Remyjungle",
    pixelCoords: [3362, 5287],
  },
  remy_waterfall: {
    name: "Remywaterfall",
    pixelCoords: [3754, 5967],
  },
  floridanot: {
    name: "Floridanot",
    pixelCoords: [3221, 6901],
  },
  tobytopia: {
    name: "Tobytopian Mangrovia",
    pixelCoords: [4102, 4679],
  },
  tobytopia_south_place: {
    name: "Tobytopian Southern Territories",
    pixelCoords: [4222, 5772],
  },
  tobytopia_jungle_island: {
    name: "Unnamed Tobytopian Jungle Island",
    pixelCoords: [3477, 5366],
  },
  korolarachi_snowplace: {
    name: "Korolarachi Snowplace",
    pixelCoords: [5497, 5357],
  },
  holden_iceberg: {
    name: "Holden's Iceberg",
    pixelCoords: [5647, 6064],
  },
  holden_house: {
    name: "Holden's House",
    pixelCoords: [5312, 6908],
  },
  holden_cave: {
    name: "Upper Limbo",
    pixelCoords: [5339, 7197],
  },
}
