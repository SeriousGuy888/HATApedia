import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const WorldMap = () => {
  const icon = L.icon({
    iconUrl: "/images/map/markers/banner.png",
    iconSize: [16, 16],
    iconAnchor: [8, 16],
  })

  return (
    <MapContainer
      center={[0, 0]}
      minZoom={1}
      maxZoom={6}
      zoom={1}
      zoomSnap={0.25}
      zoomDelta={0.25}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", backgroundColor: "black", imageRendering: "pixelated" }}
    >
      <TileLayer
        attribution="HATA SMP World Map"
        url="/map_tile/{z}/{x}/{y}.png"
        noWrap
        maxNativeZoom={4}
      />
      <Marker position={[0, 0]} icon={icon} draggable >
        <Popup>Forgsville</Popup>
      </Marker>
    </MapContainer>
  )
}

export default WorldMap
