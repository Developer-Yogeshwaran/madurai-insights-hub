import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { energyData, dailyEnergy } from '@/data/cityData';
import { Zap, Sun, Factory } from 'lucide-react';
import StatCard from './StatCard';

export default function EnergyModule() {
  const totalMonthly = energyData.reduce((s, d) => s + d.residential + d.commercial + d.industrial, 0);
  const peakHour = dailyEnergy.reduce((max, d) => d.consumption > max.consumption ? d : max, dailyEnergy[0]);
  const totalSolar = dailyEnergy.reduce((s, d) => s + d.solar, 0);

  return (
    <div className="space-y-4">
      <div className="module-header module-header-energy mb-2">
        <span className="module-badge" style={{background: 'hsl(30 95% 55%)'}} />
        <Zap className="w-5 h-5 neon-text-orange" />
        <h2>Energy Consumption</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="Annual Total" value={`${(totalMonthly / 1000).toFixed(1)} GWh`} icon={Zap} glowColor="orange" trend={{ value: 5.4, positive: false }} />
        <StatCard title="Peak Demand" value={peakHour.hour} subtitle={`${peakHour.consumption} MW`} icon={Factory} glowColor="blue" />
        <StatCard title="Daily Solar" value={`${totalSolar} MWh`} icon={Sun} glowColor="green" trend={{ value: 18, positive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Monthly Consumption by Sector</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 10, color: 'hsl(215, 20%, 55%)' }} />
              <Bar dataKey="residential" stackId="a" fill="hsl(160, 84%, 45%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="commercial" stackId="a" fill="hsl(200, 90%, 50%)" />
              <Bar dataKey="industrial" stackId="a" fill="hsl(30, 95%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Daily Load vs Solar Generation</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyEnergy}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(30, 95%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(30, 95%, 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="consumption" stroke="hsl(30, 95%, 55%)" fill="url(#energyGrad)" strokeWidth={2} name="Consumption (MW)" />
              <Area type="monotone" dataKey="solar" stroke="hsl(160, 84%, 45%)" fill="url(#solarGrad)" strokeWidth={2} name="Solar (MW)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
