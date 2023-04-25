import { BannerColour } from "./icons"

export interface MapLocation {
  name: string
  description?: string
  articles?: string[]
  pixelCoords: [number, number]
  banner?: BannerColour
}

export const locations: { [key: string]: MapLocation } = {
  spawn: {
    name: "Spawn",
    description:
      "This is where people spawn into the world. It is now home to several floating islands with stuff on them.",
    pixelCoords: [4442, 4812],
  },
  un: {
    name: "United Nations HQ",
    description:
      "Originally just some house that Arvi built and intended to sell, this building has since been converted by Remy into the headquarters of the United Nations.",
    articles: ["united_nations", "arvi"],
    pixelCoords: [4554, 4762],
    banner: "cyan",
  },
  billzoplace: {
    name: "Billzoplace",
    description: "A small city state at the intersection of three rivers.",
    articles: ["billzoplace"],
    pixelCoords: [4157, 4960],
    banner: "blue",
  },
  oil_rig: {
    name: "Limedye Oil Rig",
    description:
      "An oil rig, as part of Project Pollution, built by Billzoshoom in order to pump as much pollution as practically possible into the ocean and the air. (Built atop a slime farm)",
    articles: ["billzoplace"],
    pixelCoords: [3998, 5098],
    banner: "blue",
  },
  billzo_random_island: {
    name: "Billzoplace Random Island",
    articles: ["billzoplace"],
    pixelCoords: [2195, 6095],
    banner: "blue",
  },
  forgsville: {
    name: "Forgsville",
    description:
      "The first province of the Remy Republic. Home to RemyForg and the famous Forgsville rollercoaster.",
    articles: ["remy_republic"],
    pixelCoords: [4355, 5364],
    banner: "purple",
  },
  no: {
    name: "No",
    description:
      "A huge wheat plantation started by Remy and massively expanded by Billzoshoom with some help from Arvi while Remy was on vacation. No is the heart of the Remyan agricultural industry.",
    articles: ["remy_republic", "mangrovepox"],
    pixelCoords: [4416, 5363],
    banner: "purple",
  },
  scammington: {
    name: "Scammington",
    description:
      "A beach where Remy plans to turn into a luxury resort or something like that in order to siphon as much money out of its visitors as possible. Still waiting on that Shimadome...",
    articles: ["remy_republic", "scammington"],
    pixelCoords: [4312, 5264],
    banner: "purple",
  },
  hawainot: {
    name: "Hawainot",
    description: "Capital of the Remy Republic. Toby really wants it.",
    articles: ["remy_republic"],
    pixelCoords: [4020, 5265],
    banner: "purple",
  },
  new_mangrovia: {
    name: "New Mangrovia",
    description:
      "Formerly known as Remyan Mangrovia, but renamed after the resolution of the Great Mangrove War.",
    articles: ["remy_republic", "tobytopia", "remy", "holden"],
    pixelCoords: [4282, 4869],
    banner: "purple",
  },
  remy_jungle: {
    name: "Remyjungle",
    description:
      "Remy claimed this after Toby yoinked the nearby jungle island before Remy could claim it.",
    articles: ["remy_republic"],
    pixelCoords: [3362, 5287],
    banner: "purple",
  },
  remy_waterfall: {
    name: "Remywaterfall",
    description:
      "A cool waterfall that Remy claimed on his way to claim Floridanot.",
    articles: ["remy_republic"],
    pixelCoords: [3754, 5967],
    banner: "purple",
  },
  floridanot: {
    name: "Floridanot",
    description: "Far away vacation home for Remy.",
    articles: ["remy_republic"],
    pixelCoords: [3221, 6901],
    banner: "purple",
  },
  tobytopia: {
    name: "Tobytopian Mangrovia",
    description:
      "AKA the Swamp of Secrets. Home of many hidden bases and literally nothing on the surface.",
    articles: ["tobytopia"],
    pixelCoords: [4102, 4679],
    banner: "orange",
  },
  tobytopia_south_place: {
    name: "Tobytopian Southern Territories",
    description: "Home of Toby's beach house.",
    articles: ["tobytopia"],
    pixelCoords: [4222, 5772],
    banner: "orange",
  },
  tobytopia_jungle_island: {
    name: "Unnamed Tobytopian Jungle Island",
    description:
      "An island claimed by Toby right before Remy was going to claim it.",
    articles: ["tobytopia", "remy_republic", "remy", "toby"],
    pixelCoords: [3477, 5366],
    banner: "orange",
  },
  korolarachi_snowplace: {
    name: "Korolarachi Snowplace",
    description: "It has polar bears.",
    articles: ["korolarachi"],
    pixelCoords: [5497, 5357],
    banner: "yellow",
  },
  holden_iceberg: {
    name: "Holden's Iceberg",
    description: "Cold",
    articles: ["holden"],
    pixelCoords: [5647, 6064],
    banner: "lime",
  },
  holden_house: {
    name: "Holden's House",
    description: "Holden lives here with his roommate Cary Owo.",
    articles: ["holden"],
    pixelCoords: [5312, 6908],
    banner: "lime",
  },
  holden_cave: {
    name: "Upper Limbo",
    description: "Some cave of Holden's",
    articles: ["holden"],
    pixelCoords: [5339, 7197],
    banner: "lime",
  },
}
