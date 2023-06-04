interface City {
  weatherSource: string
  display: {
    name: string
    country: string
  }
}

export interface CityDisplayData {
  id: string
  name: string
  country: string
}

const masterCityList: { [id: string]: City } = {
  forgsville: {
    weatherSource: "Toronto",
    display: {
      name: "Forgsville",
      country: "Remy Republic",
    },
  },
  hawainot: {
    weatherSource: "Honolulu",
    display: {
      name: "Hawainot",
      country: "Remy Republic",
    },
  },
  swamp_of_secrets: {
    weatherSource: "New Orleans",
    display: {
      name: "Swamp of Secrets",
      country: "Tobytopia",
    },
  },
  billzoplace: {
    weatherSource: "Ottawa",
    display: {
      name: "Billzoplace",
      country: "Billzoplace City State",
    },
  },
}

/**
  Processes the masterCityList into a format that can be used by the client
  
  @example
  {
    forgsville: {
      id: "forgsville",
      name: "Forgsville",
      country: "Remy Republic",
    },
    ...
  }
*/
export function getClientCityList(): { [id: string]: CityDisplayData } {
  return Object.keys(masterCityList).reduce(
    (acc, cityId) => ({
      ...acc,
      [cityId]: {
        id: cityId,
        ...masterCityList[cityId].display,
      },
    }),
    {},
  )
}

/**
  Processes the masterCityList into a kvp of city id to real city weather source
  Example:

  @example
  { 
    forgsville: "Toronto",
    ...
  }
*/
export function getFakeCityRealCityMap(): { [id: string]: string } {
  return Object.keys(masterCityList).reduce(
    (acc, cityId) => ({
      ...acc,
      [cityId]: masterCityList[cityId].weatherSource,
    }),
    {},
  )
}
