import { BannerColour } from "./icons"

interface MapLocation {
  name: string
  description?: string
  pixelCoords: [number, number]
  banner?: BannerColour
}

export const cityLocations: { [key: string]: MapLocation } = {
  spawn: {
    name: "Spawn",
    pixelCoords: [4442, 4812],
  },
  un: {
    name: "United Nations HQ",
    pixelCoords: [4554, 4762],
    banner: "cyan",
  },
  billzoplace: {
    name: "Billzoplace",
    pixelCoords: [4157, 4960],
    banner: "blue",
  },
  oilrig: {
    name: "Limedye Oilrig",
    pixelCoords: [3998, 5098],
    banner: "blue",
  },
  billzo_random_island: {
    name: "Billzoplace Random Island",
    pixelCoords: [2195, 6095],
    banner: "blue",
  },
  forgsville: {
    name: "Forgsville",
    pixelCoords: [4355, 5364],
    banner: "purple",
  },
  no: {
    name: "No",
    pixelCoords: [4416, 5363],
    banner: "purple",
  },
  scammington: {
    name: "Scammington",
    pixelCoords: [4312, 5264],
    banner: "purple",
  },
  hawainot: {
    name: "Hawainot",
    pixelCoords: [4020, 5265],
    banner: "purple",
  },
  new_mangrovia: {
    name: "New Mangrovia",
    description: "Formerly known as Remyan Mangrovia",
    pixelCoords: [4282, 4869],
    banner: "purple",
  },
  remy_jungle: {
    name: "Remyjungle",
    pixelCoords: [3362, 5287],
    banner: "purple",
  },
  remy_waterfall: {
    name: "Remywaterfall",
    pixelCoords: [3754, 5967],
    banner: "purple",
  },
  floridanot: {
    name: "Floridanot",
    pixelCoords: [3221, 6901],
    banner: "purple",
  },
  tobytopia: {
    name: "Tobytopian Mangrovia",
    pixelCoords: [4102, 4679],
    banner: "orange",
  },
  tobytopia_south_place: {
    name: "Tobytopian Southern Territories",
    pixelCoords: [4222, 5772],
    banner: "orange",
  },
  tobytopia_jungle_island: {
    name: "Unnamed Tobytopian Jungle Island",
    pixelCoords: [3477, 5366],
    banner: "orange",
  },
  korolarachi_snowplace: {
    name: "Korolarachi Snowplace",
    pixelCoords: [5497, 5357],
    banner: "yellow",
  },
  holden_iceberg: {
    name: "Holden's Iceberg",
    pixelCoords: [5647, 6064],
    banner: "lime",
  },
  holden_house: {
    name: "Holden's House",
    pixelCoords: [5312, 6908],
    banner: "lime",
  },
  holden_cave: {
    name: "Upper Limbo",
    pixelCoords: [5339, 7197],
    banner: "lime",
  },
}
