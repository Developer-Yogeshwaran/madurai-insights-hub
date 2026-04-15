import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { pollutionData, wasteBins, predictionData } from '../data/cityData';
import { predictSites } from '../ml/predictor';
import React from 'react';
import { emitRealtimeUpdate, emitNotification } from '../lib/utils';
import L from 'leaflet';

function ClusterLayer({ sites }: { sites: any[] }) {
  const map = useMap();
  const layerRef = React.useRef<any>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // dynamically import plugin (plugin augments L)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await import('leaflet.markercluster');

        if (!mounted) return;
        const markers = L.markerClusterGroup();
        sites.forEach((s) => {
          const m = L.marker([s.lat, s.lng]);
          m.bindPopup(`<div><strong>${s.name}</strong><div>AQI: ${s.pollution?.aqi ?? 'N/A'}</div></div>`);
          markers.addLayer(m);
        });
        layerRef.current = markers;
        map.addLayer(markers);
      } catch (err) {
        console.warn('MarkerCluster load failed, falling back to individual markers', err);
      }
    })();

    return () => {
      mounted = false;
      if (layerRef.current) {
        try { map.removeLayer(layerRef.current); } catch (e) { /* ignore */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, JSON.stringify(sites.map((s) => `${s.lat},${s.lng}`))]);

  return null;
}

function ResetViewOnMount({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export default function MapPage() {
  // Build a sites list by merging pollutionData and wasteBins (unique by lat+lng)
  const sitesMap = new Map<string, any>();

  pollutionData.forEach((p) => {
    const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
    sitesMap.set(key, { name: p.area, lat: p.lat, lng: p.lng, pollution: p });
  });

  wasteBins.forEach((b) => {
    const key = `${b.lat.toFixed(5)},${b.lng.toFixed(5)}`;
    const existing = sitesMap.get(key) || { name: b.area, lat: b.lat, lng: b.lng };
    existing.waste = existing.waste || [];
    existing.waste.push(b);
    sitesMap.set(key, existing);
  });

  // Add prediction snippets (attach pollution predictions where possible)
  const pollutionPreds = predictionData.pollution || [];
  let i = 0;
  for (const site of sitesMap.values()) {
    site.prediction = pollutionPreds[i % pollutionPreds.length];
    // add mock traffic & energy values for visualization
    site.traffic = { congestion: Math.round(20 + Math.random() * 80) };
    site.energy = { consumption: Math.round(200 + Math.random() * 800) };
    i++;
  }

  const initialSites = Array.from(sitesMap.values());
  const [sites, setSites] = React.useState(initialSites);
  const [query, setQuery] = React.useState('');
  const q = query.trim().toLowerCase();
  const filteredSites = q ? sites.filter((s) => (s.name || '').toLowerCase().includes(q)) : sites;
  const center: [number, number] = [9.9208, 78.1210];
  const [clustered, setClustered] = React.useState(true);

  // Mock realtime updates: adjust values periodically and broadcast via EventBus
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setSites((prev) => {
        const next = prev.map((s) => {
          const copy = { ...s } as any;
          if (copy.waste) {
            copy.waste = copy.waste.map((b: any) => ({
              ...b,
              fill: Math.max(0, Math.min(100, b.fill + Math.round((Math.random() - 0.5) * 10)))
            }));
          }
          if (copy.pollution) {
            copy.pollution = { ...copy.pollution, aqi: Math.max(10, copy.pollution.aqi + Math.round((Math.random() - 0.5) * 12)) };
          }
          if (copy.traffic) {
            copy.traffic = { congestion: Math.max(0, Math.min(100, copy.traffic.congestion + Math.round((Math.random() - 0.5) * 12))) };
          }
          if (copy.energy) {
            copy.energy = { consumption: Math.max(10, copy.energy.consumption + Math.round((Math.random() - 0.5) * 60)) };
          }
          return copy;
        });
        // Emit telemetry update
        emitRealtimeUpdate({ timestamp: Date.now(), sites: next });

        // Generate notifications for threshold crossings
        next.forEach((s, idx) => {
          const prevS = prev[idx];
          const prevAqi = prevS?.pollution?.aqi ?? 0;
          const newAqi = s?.pollution?.aqi ?? 0;
          if (newAqi >= 150 && prevAqi < 150) {
            emitNotification({ title: `Hazardous AQI at ${s.name}`, body: `AQI jumped to ${newAqi}`, level: 'critical', ts: Date.now() });
          }
          const prevCong = prevS?.traffic?.congestion ?? 0;
          const newCong = s?.traffic?.congestion ?? 0;
          if (newCong >= 85 && prevCong < 85) {
            emitNotification({ title: `Traffic spike at ${s.name}`, body: `Congestion ${newCong}%`, level: 'warn', ts: Date.now() });
          }
          // Waste bin critical
          if (s.waste) {
            s.waste.forEach((b: any) => {
              const prevBin = (prevS?.waste || []).find((x: any) => x.id === b.id) || { fill: 0 };
              if (b.fill >= 90 && prevBin.fill < 90) {
                emitNotification({ title: `Bin ${b.id} critical`, body: `${b.area} fill ${b.fill}%`, level: 'warn', ts: Date.now() });
              }
            });
          }
        });
        return next;
      });
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  // Predictive alerts from initial predictions
  React.useEffect(() => {
    sites.forEach((s) => {
      if (s.prediction?.predictedAqi && s.prediction.predictedAqi >= 150) {
        emitNotification({ title: `Predicted hazardous AQI at ${s.name}`, body: `Predicted AQI ${s.prediction.predictedAqi}`, level: 'warn', ts: Date.now() });
      }
      if (s.prediction?.predicted && s.prediction.predicted >= 20000) {
        emitNotification({ title: `Predicted traffic spike at ${s.name}`, body: `Predicted vehicles ${s.prediction.predicted}`, level: 'info', ts: Date.now() });
      }
    });
    // only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">City Map — Madurai</h1>
            <p className="text-sm text-muted-foreground mb-4">Interactive map tools for visualizing air quality, smart-bin status, traffic congestion and AI predictions. Toggle layers to focus on specific city telemetry.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold mb-2">What you'll find here</h3>
                <ul className="text-sm list-disc ml-4 text-muted-foreground">
                  <li>Layer controls for Traffic, Pollution, Energy, Waste and AI Predictions</li>
                  <li>Color-coded markers and popups showing recent readings</li>
                  <li>Export CSV for bins and quick external links</li>
                </ul>
              </div>

              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold mb-2">Quick actions</h3>
                <div className="flex flex-col gap-2">
                  <Link to="/" className="nav-pill inline-flex items-center justify-between">Return Home <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  <a href="https://clean-madurai-698f3.web.app/" target="_blank" rel="noopener noreferrer" className="badge-link">Open Clean Madurai</a>
                  <button className="nav-pill" onClick={() => {
                    const csv = ['id,area,fill,type,lastCollected,lat,lng'];
                    sites.forEach((s) => {
                      if (s.waste) s.waste.forEach((b: any) => csv.push([b.id, b.area, b.fill, b.type, b.lastCollected, b.lat, b.lng].join(',')));
                    });
                    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = 'bins.csv'; a.click(); URL.revokeObjectURL(url);
                  }}>Export Bins CSV</button>
                  <button className="nav-pill" onClick={async () => {
                    try {
                      (window as any).dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Running predictions (client)...' } }));
                      const results = await predictSites(sites);
                      const next = sites.map((s, i) => ({ ...s, prediction: { ...s.prediction, predictedAqi: results[i].predictedAqi, confidence: results[i].confidence } }));
                      setSites(next);
                      (window as any).dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Predictions complete' } }));
                    } catch (err) {
                      console.error(err);
                      (window as any).dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Prediction failed' } }));
                    }
                  }}>Run Predictions (TFJS)</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 glass-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <input
            aria-label="Filter sites"
            placeholder="Filter by area (e.g. Meenakshi, Anna Nagar)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input w-full max-w-sm"
          />
          <div className="ml-2 flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Cluster markers</label>
            <input type="checkbox" checked={clustered} onChange={(e) => setClustered(e.target.checked)} />
          </div>
          {query && (
            <button className="nav-pill" onClick={() => setQuery('')}>Clear</button>
          )}
        </div>

        <div className="w-full h-[60vh] rounded-md overflow-hidden">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <ResetViewOnMount center={center} zoom={13} />
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marker clustering layer (uses leaflet.markercluster) */}
            {clustered ? (
              <ClusterLayer sites={filteredSites} />
            ) : null}

            <LayersControl position="topright">
              <LayersControl.Overlay name="Traffic">
                <LayerGroup>
                  {filteredSites.map((s, idx) => (
                    <CircleMarker
                      key={`traffic-${idx}`}
                      center={[s.lat, s.lng]}
                      radius={8}
                      className="pulse-marker"
                      pathOptions={{ color: 'hsl(200 90% 50%)', fillColor: 'hsl(200 90% 50%)', fillOpacity: 0.8 }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{s.name}</strong>
                          <div>Congestion: {s.traffic.congestion}%</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Pollution" checked>
                <LayerGroup>
                  {filteredSites.map((s, idx) => {
                    const aqi = s.pollution?.aqi ?? 0;
                    const aqiColor = aqi <= 50 ? 'hsl(160 84% 45%)' : aqi <= 100 ? 'hsl(200 90% 50%)' : aqi <= 150 ? 'hsl(30 95% 55%)' : 'hsl(0 85% 55%)';
                    const radius = Math.min(12, Math.max(6, (aqi / 20) + 4));
                    return (
                      <CircleMarker key={`poll-${idx}`} center={[s.lat, s.lng]} radius={radius} pathOptions={{ color: aqiColor, fillColor: aqiColor, fillOpacity: 0.75 }} className={aqi > 150 ? 'pulse-marker' : ''}>
                        <Popup>
                          <div className="text-sm">
                            <strong>{s.name}</strong>
                            {s.pollution && (
                              <>
                                <div>AQI: {s.pollution.aqi} — {s.pollution.pm25} μg/m³ (PM2.5)</div>
                                <div className="mt-1"><span className="font-medium">Status:</span> {s.pollution.aqi <= 100 ? 'Moderate/Good' : 'Poor'}</div>
                              </>
                            )}
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Energy">
                <LayerGroup>
                  {filteredSites.map((s, idx) => (
                    <CircleMarker
                      key={`energy-${idx}`}
                      center={[s.lat, s.lng]}
                      radius={6}
                      pathOptions={{ color: '#f97316', fillColor: '#fb923c', fillOpacity: 0.6 }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{s.name}</strong>
                          <div>Consumption: {s.energy.consumption} kWh</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Waste">
                <LayerGroup>
                  {filteredSites.flatMap((s, idx) => (s.waste ? s.waste.map((b: any, j: number) => (
                    <Marker key={`bin-${idx}-${j}`} position={[b.lat, b.lng]}>
                      <Popup>
                        <div className="text-sm">
                          <strong>{b.id} — {b.area}</strong>
                          <div>Fill: {b.fill}%</div>
                          <div>Type: {b.type}</div>
                          <div>Last: {b.lastCollected}</div>
                        </div>
                      </Popup>
                    </Marker>
                  )) : []))}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="AI Predictions">
                <LayerGroup>
                  {filteredSites.map((s, idx) => (
                    <Marker key={`pred-${idx}`} position={[s.lat, s.lng]}>
                      <Popup>
                        <div className="text-sm">
                          <strong>{s.name}</strong>
                          {s.prediction && (
                            <>
                              <div>Predicted AQI (next): {s.prediction.predictedAqi}</div>
                              <div>Confidence: {Math.round(s.prediction.confidence * 100)}%</div>
                            </>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
          {/* Floating legend */}
          <div className="map-legend absolute top-4 right-4 z-50 w-48">
            <div className="glass-card p-3">
              <h4 className="text-sm font-semibold mb-2">Map Legend</h4>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background:'hsl(200 90% 50%)'}}></span> Traffic (congestion)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background:'hsl(160 84% 45%)'}}></span> AQI Good</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background:'hsl(200 90% 50%)'}}></span> AQI Moderate</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background:'hsl(30 95% 55%)'}}></span> AQI Unhealthy</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background:'hsl(0 85% 55%)'}}></span> AQI Hazardous</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 glass-card p-4">
        <h2 className="text-lg font-semibold mb-2">Map Notes & Tips</h2>
        <ol className="list-decimal ml-5 text-sm text-muted-foreground">
          <li>Toggle layers to focus on Traffic, Pollution, Energy, Waste, or AI Predictions.</li>
          <li>Click markers to view recent readings and prediction snippets.</li>
          <li>If tiles fail to load, check network or try a different theme for contrast.</li>
        </ol>
      </div>
    </div>
  );
}
