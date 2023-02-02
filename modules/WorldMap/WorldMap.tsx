import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"

const MapEvents = () => {
  useMapEvents({
    click(e) {
      window.alert(e.latlng)
    },
  })
  return <></>
}

const WorldMap = () => {
  const [map, setMap] = useState<L.Map | null>(null)

  const mapSW = L.point(0, 8192)
  const mapNE = L.point(8192, 0)
  const mapBoundsZoomLvl = 5

  useEffect(() => {
    if (!map) {
      return
    }

    const bounds = new L.LatLngBounds(
      map.unproject(mapSW, mapBoundsZoomLvl),
      map.unproject(mapNE, mapBoundsZoomLvl),
    )
    console.log(map.getMaxZoom())

    map.setMaxBounds(bounds)
  }, [map])

  const markerIcon = L.icon({
    iconUrl: "/images/map/markers/banner.png",
    iconSize: [16, 16],
    iconAnchor: [8, 16],
  })

  return (
    <MapContainer
      center={[0, 0]}
      minZoom={1}
      maxZoom={8}
      zoom={1}
      zoomSnap={0.25}
      zoomDelta={0.5}
      scrollWheelZoom={true}
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        imageRendering: "pixelated",
      }}
      crs={L.CRS.Simple}
      ref={setMap}
    >
      <MapEvents />
      <TileLayer
        attribution="HATA SMP World Map"
        url="/map_tile/{z}/{x}/{y}.png"
        noWrap
        minNativeZoom={1}
        maxNativeZoom={5}
      />
      <Marker position={[0, 0]} icon={markerIcon} draggable>
        <Popup>Forgsville</Popup>
      </Marker>
    </MapContainer>
  )
}

export default WorldMap
