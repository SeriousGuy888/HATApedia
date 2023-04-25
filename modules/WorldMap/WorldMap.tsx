import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useCallback, useEffect, useState } from "react"
import { locations, MapLocation } from "./map_locations"
import { BannerColour } from "./icons"
import MapInfoDisplay from "./MapInfoDisplay"

const WorldMap = () => {
  const [map, setMap] = useState<L.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<string>("")

  const fullImgZoom = 5 // Largest zoom level
  const fullImgDim = [8192, 8192] // Dimensions of image sliced up in the largest zoom level
  const mapSW = L.point(0, fullImgDim[1])
  const mapNE = L.point(fullImgDim[0], 0)

  useEffect(() => {
    if (!map) {
      return
    }

    const bounds = new L.LatLngBounds(
      map.unproject(mapSW, fullImgZoom),
      map.unproject(mapNE, fullImgZoom),
    )
    map.setMaxBounds(bounds)

    map.on("click", () => {
      setSelectedMarker("")
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  const getMarkerInfo = useCallback((): MapLocation => {
    if (selectedMarker in locations) {
      return locations[selectedMarker]
    } else {
      return {
        pixelCoords: [0, 0],
        name: "HATA SMP World Map",
        description: "Click a map marker to \nsee more information about it.",
      }
    }
  }, [selectedMarker])

  const getBannerMarker = (colour: BannerColour, biggify: boolean) => {
    const scale = biggify ? 2 : 1
    return L.icon({
      iconUrl: `/map/markers/banner_${colour}.png`,
      iconSize: [16 * scale, 16 * scale],
      iconAnchor: [8 * scale, 16 * scale],
    })
  }

  return (
    <section className="w-full h-full flex flex-col lg:flex-row overflow-hidden">
      <MapContainer
        center={fullImgDim.map((e) => e / 2) as [number, number]}
        minZoom={1}
        maxZoom={8}
        zoom={1}
        zoomSnap={0.25}
        zoomDelta={0.5}
        scrollWheelZoom={true}
        crs={L.CRS.Simple}
        ref={setMap}
        className="w-full h-full select-none flex-[3]"
        style={{
          backgroundColor: "black",
          imageRendering: "pixelated",
        }}
      >
        <TileLayer
          attribution="HATA SMP World Map"
          url="/map_tile/{z}/{x}/{y}.png"
          noWrap
          minNativeZoom={1}
          maxNativeZoom={fullImgZoom}
        />
        <LayersControl position="topright">
          <LayersControl.Overlay name="Cities/Settlements" checked>
            <LayerGroup>
              {Object.keys(locations).map((key) => {
                const loc = locations[key]

                return (
                  <Marker
                    key={key}
                    position={
                      map?.unproject(loc.pixelCoords, fullImgZoom) ?? [0, 0]
                    }
                    icon={getBannerMarker(
                      loc.banner || "white",
                      selectedMarker === key,
                    )}
                    eventHandlers={{
                      click: () => {
                        setSelectedMarker(key)
                      },
                    }}
                    alt={loc.name || "Map Marker"}
                    riseOnHover
                    autoPanOnFocus
                  />
                )
              })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      <MapInfoDisplay marker={getMarkerInfo()} />
    </section>
  )
}

export default WorldMap
