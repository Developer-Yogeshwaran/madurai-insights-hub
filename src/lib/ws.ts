import { emitRealtimeUpdate, emitNotification } from './utils';

// Use Vite env `VITE_WS_URL` when deployed; fallback to localhost for dev
const DEFAULT_WS_URL = (typeof import.meta !== 'undefined' && (import.meta.env as any)?.VITE_WS_URL) || 'http://localhost:4000';

export function startWebsocketClient(url = DEFAULT_WS_URL) {
  // dynamic import to avoid SSR/type issues
  (async () => {
    try {
      const { io } = await import('socket.io-client');
      const socket = io(url, { transports: ['websocket', 'polling'] });

      socket.on('connect', () => {
        console.log('ws-client connected', socket.id);
      });

      socket.on('hello', (d) => console.log('ws hello', d));

      socket.on('telemetry', (payload) => {
        try {
          // Integrate with app EventBus
          emitRealtimeUpdate(payload);

          // Check for simple thresholds and issue notifications
          payload.sites?.forEach((s) => {
            const aqi = s.pollution?.aqi ?? 0;
            if (aqi >= 150) {
              emitNotification({ title: `Live Hazardous AQI at ${s.name}`, body: `AQI ${aqi}`, level: 'critical', ts: Date.now() });
            }
            if (s.waste && s.waste[0]?.fill >= 90) {
              emitNotification({ title: `Live Bin critical at ${s.name}`, body: `Fill ${s.waste[0].fill}%`, level: 'warn', ts: Date.now() });
            }
          });
        } catch (err) {
          console.error('ws-client processing error', err);
        }
      });

      socket.on('disconnect', () => console.log('ws-client disconnected'));
    } catch (err) {
      console.warn('Failed to load socket.io-client', err);
    }
  })();
}
