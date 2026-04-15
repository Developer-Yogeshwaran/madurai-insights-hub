import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { trafficData, weeklyTraffic } from '@/data/cityData';
import { Car, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';

export default function TrafficModule() {
  const peakHour = trafficData.reduce((max, d) => d.vehicles > max.vehicles ? d : max, trafficData[0]);
  const avgSpeed = Math.round(trafficData.reduce((s, d) => s + d.avgSpeed, 0) / trafficData.length);
  const totalIncidents = weeklyTraffic.reduce((s, d) => s + d.incidents, 0);

  return (
    <div className="space-y-4">
      <div className="module-header module-header-traffic mb-2">
        <span className="module-badge" style={{background: 'hsl(200 90% 50%)'}} />
        <Car className="w-5 h-5 neon-text-blue" />
        <h2>Traffic Analysis</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="Peak Hour" value={peakHour.hour} subtitle={`${peakHour.vehicles} vehicles`} icon={TrendingUp} glowColor="blue" />
        <StatCard title="Avg Speed" value={`${avgSpeed} km/h`} icon={Car} glowColor="green" trend={{ value: 3.2, positive: true }} />
        <StatCard title="Weekly Incidents" value={totalIncidents} icon={AlertTriangle} glowColor="orange" trend={{ value: 12, positive: false }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="fancy-card p-4">
          <div className="glass-gradient-outline" />
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Hourly Traffic Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200, 90%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(200, 90%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="vehicles" stroke="hsl(200, 90%, 50%)" fill="url(#trafficGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="fancy-card p-4">
          <div className="glass-gradient-outline" />
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Average Speed & Congestion</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="avgSpeed" stroke="hsl(160, 84%, 45%)" strokeWidth={2} dot={false} name="Speed (km/h)" />
              <Line type="monotone" dataKey="congestionIndex" stroke="hsl(30, 95%, 55%)" strokeWidth={2} dot={false} name="Congestion Index" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
