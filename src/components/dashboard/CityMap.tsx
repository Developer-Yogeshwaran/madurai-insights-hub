import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { pollutionData, wasteBins, getAqiLevel, getBinStatus } from '@/data/cityData';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function CityMap() {
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#3b82f6';
    if (aqi <= 150) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 neon-text-blue" />
        <h2 className="text-lg font-semibold">Interactive City Map</h2>
        <div className="ml-auto flex gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-green inline-block" /> AQI Zones</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-orange inline-block" /> Smart Bins</span>
        </div>
      </div>

      <div className="glass-card p-2 overflow-hidden rounded-xl" style={{ height: 350 }}>
        <MapContainer center={[9.925, 78.115]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 12 }} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          {pollutionData.map((p, i) => (
            <CircleMarker key={`p-${i}`} center={[p.lat, p.lng]} radius={Math.max(8, p.aqi / 10)} fillColor={getAqiColor(p.aqi)} color={getAqiColor(p.aqi)} fillOpacity={0.5} weight={1}>
              <Popup>
                <div style={{ color: '#000', fontSize: 12 }}>
                  <strong>{p.area}</strong><br />
                  AQI: {p.aqi} ({getAqiLevel(p.aqi).label})<br />
                  PM2.5: {p.pm25} µg/m³
                </div>
              </Popup>
            </CircleMarker>
          ))}
          {wasteBins.map((b, i) => (
            <CircleMarker key={`b-${i}`} center={[b.lat + 0.002, b.lng + 0.002]} radius={5} fillColor={b.fill >= 90 ? '#ef4444' : '#f59e0b'} color="#fff" fillOpacity={0.8} weight={1}>
              <Popup>
                <div style={{ color: '#000', fontSize: 12 }}>
                  <strong>{b.id}</strong> - {b.area}<br />
                  Fill: {b.fill}% ({getBinStatus(b.fill).label})<br />
                  Type: {b.type}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
