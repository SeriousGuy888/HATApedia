import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const MapEvents = () => {
  useMapEvents({
    click(e) {
      window.alert(e.latlng)
    },
  })
  return <></>
}

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
    >
      <TileLayer
        attribution="HATA SMP World Map"
        url="/map_tile/{z}/{x}/{y}.png"
        noWrap
        maxNativeZoom={5}
      />
      <MapEvents />
      <Marker position={[0, 0]} icon={icon} draggable>
        <Popup>Forgsville</Popup>
      </Marker>
    </MapContainer>
  )
}

export default WorldMap
