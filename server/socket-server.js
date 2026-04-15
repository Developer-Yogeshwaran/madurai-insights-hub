import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 4000;

function randomBetween(min, max) { return Math.round(min + Math.random() * (max - min)); }

// Example site list (simplified) — coordinates around Madurai
const sites = [
  { id: 'S1', name: 'Meenakshi', lat: 9.9195, lng: 78.1194 },
  { id: 'S2', name: 'Anna Nagar', lat: 9.9360, lng: 78.1180 },
  { id: 'S3', name: 'Madakulam', lat: 9.9150, lng: 78.1270 },
  { id: 'S4', name: 'Gandhi Park', lat: 9.9250, lng: 78.1310 },
  { id: 'S5', name: 'Simmakkal', lat: 9.9300, lng: 78.1150 }
];

io.on('connection', (socket) => {
  console.log('ws: client connected', socket.id);
  socket.emit('hello', { msg: 'welcome' });

  socket.on('disconnect', () => {
    console.log('ws: client disconnected', socket.id);
  });
});

// Emit telemetry periodically
setInterval(() => {
  const payload = {
    timestamp: Date.now(),
    sites: sites.map((s) => ({
      id: s.id,
      name: s.name,
      lat: s.lat + (Math.random() - 0.5) * 0.001,
      lng: s.lng + (Math.random() - 0.5) * 0.001,
      pollution: { aqi: randomBetween(30, 200), pm25: randomBetween(10, 150) },
      traffic: { congestion: randomBetween(10, 95) },
      energy: { consumption: randomBetween(100, 2000) },
      waste: [ { id: s.id + '-B1', area: s.name, fill: randomBetween(10, 100), lat: s.lat, lng: s.lng } ]
    }))
  };
  io.emit('telemetry', payload);
}, 5000);

server.listen(PORT, () => console.log(`Socket server listening on http://localhost:${PORT}`));
