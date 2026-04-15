import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';
import { pollutionData, monthlyPollution, getAqiLevel } from '@/data/cityData';
import { Wind, AlertCircle, Thermometer } from 'lucide-react';
import StatCard from './StatCard';

export default function PollutionModule() {
  const avgAqi = Math.round(pollutionData.reduce((s, d) => s + d.aqi, 0) / pollutionData.length);
  const worstArea = pollutionData.reduce((max, d) => d.aqi > max.aqi ? d : max, pollutionData[0]);
  const alertCount = pollutionData.filter(d => d.aqi > 100).length;
  const aqiLevel = getAqiLevel(avgAqi);

  const gaugeData = [{ name: 'AQI', value: avgAqi, fill: avgAqi > 150 ? 'hsl(0, 85%, 55%)' : avgAqi > 100 ? 'hsl(30, 95%, 55%)' : 'hsl(160, 84%, 45%)' }];

  const getBarColor = (aqi: number) => {
    if (aqi <= 50) return 'hsl(160, 84%, 45%)';
    if (aqi <= 100) return 'hsl(200, 90%, 50%)';
    if (aqi <= 150) return 'hsl(30, 95%, 55%)';
    return 'hsl(0, 85%, 55%)';
  };

  return (
    <div className="space-y-4">
      <div className="module-header module-header-pollution mb-2">
        <span className="module-badge" style={{background: 'hsl(0 85% 55%)'}} />
        <Wind className="w-5 h-5 neon-text-red" />
        <h2>Pollution Monitoring</h2>
        {alertCount > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs neon-text-red">
            <AlertCircle className="w-3 h-3" /> {alertCount} areas above safe limit
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="City Avg AQI" value={avgAqi} subtitle={aqiLevel.label} icon={Wind} glowColor={avgAqi > 100 ? 'orange' : 'green'} />
        <StatCard title="Worst Zone" value={worstArea.area} subtitle={`AQI: ${worstArea.aqi}`} icon={AlertCircle} glowColor="red" />
        <StatCard title="Avg PM2.5" value={`${Math.round(pollutionData.reduce((s, d) => s + d.pm25, 0) / pollutionData.length)} µg/m³`} icon={Thermometer} glowColor="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="fancy-card p-4">
          <div className="glass-gradient-outline" />
          <h3 className="text-sm font-medium text-muted-foreground mb-3">AQI by Area</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pollutionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis dataKey="area" type="category" tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} width={110} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="aqi" radius={[0, 4, 4, 0]}>
                {pollutionData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.aqi)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="fancy-card p-4">
          <div className="glass-gradient-outline" />
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Monthly AQI Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyPollution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="aqi" fill="hsl(200, 90%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pm25" fill="hsl(160, 84%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
