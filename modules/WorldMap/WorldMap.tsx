import {
  FeatureGroup,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  GeoJSON,
} from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

import { locations, MapLocation } from "./map_locations"
import { geoJsonData } from "./map_geojson_data"

import { useCallback, useEffect, useRef, useState } from "react"
import { BannerColour } from "./icons"
import MapInfoDisplay from "./MapInfoDisplay"
import { GeoJsonObject } from "geojson"

const WorldMap = () => {
  const [map, setMap] = useState<L.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<string>("")

  const editableFg = useRef<typeof FeatureGroup>(null)

  const fullImgZoom = 5 // Largest zoom level
  const fullImgDim = [10240, 10240] // Dimensions of image sliced up in the largest zoom level
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

  useEffect(() => {
    new L.GeoJSON(geoJsonData as any).eachLayer((layer) =>
      editableFg.current?.addLayer(layer),
    )
  }, [editableFg])

  const getMarkerInfo = useCallback((): MapLocation => {
    if (selectedMarker in locations) {
      return locations[selectedMarker]
    } else {
      return {
        coords: [0, 0],
        name: "HATA SMP World Map",
        description:
          "🎉Update🎉: Quality improved! The map is no longer blurry up close, and you can now see each individual block!",
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
          fontFamily: "inherit",
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

                let coords = loc.coords.map(
                  (e, i) => e + fullImgDim[i] / 2,
                ) as [number, number]

                let position =
                  map?.unproject(coords, fullImgZoom) ?? new L.LatLng(0, 0)

                return (
                  <Marker
                    key={key}
                    position={position}
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
          <LayersControl.Overlay name="For Testing Purposes" checked>
            <LayerGroup>
              <Polygon
                positions={[
                  [0, 0],
                  [-100, 0],
                  [-100, 100],
                  [0, 100],
                  [0, 0],
                ]}
                className="fill-red-500 stroke-red-500"
              >
                <Tooltip direction="center" permanent>
                  This is a square.
                </Tooltip>
              </Polygon>

              <GeoJSON data={geoJsonData as GeoJsonObject} />

              <Marker
                position={[-150, 150]}
                draggable
                icon={getBannerMarker("pink", false)}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target
                    const position = marker.getLatLng()
                    const pixelCoords = map?.project(position, fullImgZoom)
                    alert(
                      pixelCoords +
                        "\n" +
                        [pixelCoords?.x, pixelCoords?.y].map((e) =>
                          e ? Math.round(e - 5120) : 0,
                        ),
                    )
                  },
                }}
              />
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
        <FeatureGroup ref={editableFg as any}>
          <EditControl
            position="topleft"
            onEdited={(e) => {
              console.log(JSON.stringify(e.layers.toGeoJSON()))
            }}
            edit={{ remove: true }}
            draw={{
              marker: false,
              circle: false,
              rectangle: false,
              polygon: true,
              polyline: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
      <MapInfoDisplay marker={getMarkerInfo()} />
    </section>
  )
}

export default WorldMap
