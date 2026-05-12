import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({ lands = [], center = [11.0168, 76.9558] }) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '500px', borderRadius: '12px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      {lands.map((land, i) =>
        land.location?.coordinates?.lat ? (
          <Marker key={i} position={[land.location.coordinates.lat, land.location.coordinates.lng]}>
            <Popup>
              <b>Survey #: {land.surveyNumber}</b><br />
              Owner: {land.ownerName}<br />
              Area: {land.area} sq.ft<br />
              Status: {land.status}
            </Popup>
          </Marker>
        ) : null
      )}
      {lands.map((land, i) =>
        land.boundaries?.length > 2 ? (
          <Polygon
            key={`poly-${i}`}
            positions={land.boundaries.map(b => [b.lat, b.lng])}
            pathOptions={{ color: 'green' }}
          />
        ) : null
      )}
    </MapContainer>
  );
}