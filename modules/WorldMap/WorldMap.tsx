import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import { cityLocations } from "./map_locations"
import { BannerColour } from "./icons"

const MapEvents = () => {
  const map = useMap()
  useMapEvents({
    click(e) {
      window.alert(map.project(e.latlng, 5).round())
    },
  })
  return <></>
}

const WorldMap = () => {
  const [map, setMap] = useState<L.Map | null>(null)

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
    console.log(map.getMaxZoom())

    map.setMaxBounds(bounds)
  }, [map])

  const getBannerMarker = (colour: BannerColour) => {
    return L.icon({
      iconUrl: `/map/markers/banner_${colour}.png`,
      iconSize: [16, 16],
      iconAnchor: [8, 16],
    })
  }

  return (
    <MapContainer
      center={[0, 0]}
      minZoom={1}
      maxZoom={8}
      zoom={1}
      zoomSnap={0.25}
      zoomDelta={0.5}
      scrollWheelZoom={true}
      crs={L.CRS.Simple}
      ref={setMap}
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        imageRendering: "pixelated",
        userSelect: "none",
      }}
    >
      <MapEvents />
      <TileLayer
        attribution="HATA SMP World Map"
        url="/map_tile/{z}/{x}/{y}.png"
        noWrap
        minNativeZoom={1}
        maxNativeZoom={fullImgZoom}
      />
      <LayersControl position="topright">
        <LayersControl.Overlay name="Cities" checked>
          <LayerGroup>
            {Object.keys(cityLocations).map((i) => {
              const loc = cityLocations[i]

              return (
                <Marker
                  key={i}
                  position={
                    map?.unproject(loc.pixelCoords, fullImgZoom) ?? [0, 0]
                  }
                  icon={getBannerMarker(loc.banner || "white")}
                >
                  <Popup>
                    <p className="font-bold">{loc.name}</p>
                    <p className="font-sm">{loc.description ?? ""}</p>
                  </Popup>
                </Marker>
              )
            })}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}

export default WorldMap
