import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const WorldMap = () => {
  return (
    <MapContainer
      center={[0, 0]}
      maxZoom={4}
      zoom={1}
      scrollWheelZoom={true}
      style={{ height: 600, width: 600 }}
    >
      <TileLayer attribution="HATA SMP" url="./map_tile/{z}/{x}/{y}.png" />
      <Marker position={[127, 632]}>
        <Popup>Forgsville</Popup>
      </Marker>
    </MapContainer>
  )
}

export default WorldMap
