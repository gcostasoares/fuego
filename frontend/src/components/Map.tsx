import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";

interface MapProps {
  data: Array<{
    id: string | number;
    lat: number;
    long: number;
    name?: string;
    iconUrl?: string;
  }>;
  zoom?: number;
  customIconSize?: [number, number];
}

const customIcon = L.icon({
  iconUrl: "/images/other/mIcon.png",
  iconSize: [50, 50],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const UpdateMapCenter: React.FC<{ center: [number, number] }> = ({
  center,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const ShopsMap: React.FC<MapProps> = ({ data, zoom = 13 }) => {
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  return (
    <div className="hidden md:flex w-full md:w-2/3 py-4 min-h-80">
      <MapContainer
        center={center}
        zoom={zoom}
        className="md:h-full h-80 w-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UpdateMapCenter center={center} />
        {data.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.long]}
            icon={customIcon}
          >
            {item.name && <Tooltip permanent>{item.name}</Tooltip>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ShopsMap;
