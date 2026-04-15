import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import TrafficModule from '@/components/dashboard/TrafficModule';
import PollutionModule from '@/components/dashboard/PollutionModule';
import EnergyModule from '@/components/dashboard/EnergyModule';
import WasteModule from '@/components/dashboard/WasteModule';
import PredictionModule from '@/components/dashboard/PredictionModule';
import { Car, Wind, Zap, Recycle, Brain } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

const tabs = [
  { id: 'traffic', label: 'Traffic', icon: Car },
  { id: 'pollution', label: 'Pollution', icon: Wind },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'waste', label: 'Waste', icon: Recycle },
  { id: 'predictions', label: 'AI Predictions', icon: Brain },
  
] as const;

type TabId = typeof tabs[number]['id'];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>('traffic');

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <Header />
        <section className="dashboard-hero glass-card-hover">
          <div className="hero-deco" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="hero-sub">Real-time city telemetry • AI-assisted insights</p>
              <h2 className="hero-title text-2xl mt-1">Smart Madurai Dashboard</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl">Monitor air quality, traffic flow, energy demand and waste collection in one place. Use the map for spatial context and run quick in-browser AI predictions for hotspots.</p>
            </div>
            <div className="hidden sm:flex gap-3">
              <StatCard title="Active Alerts" value={3} subtitle="Critical & Warnings" icon={Brain} glowColor="red" />
              <StatCard title="Avg AQI" value={78} subtitle="Last hour" icon={Wind} glowColor="green" />
              <StatCard title="Vehicles (est)" value={12480} subtitle="Current" icon={Car} glowColor="blue" />
            </div>
          </div>
        </section>

        <nav className="glass-card p-2 flex gap-2 overflow-x-auto scrollbar-thin" style={{alignItems: 'center'}}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-pill ${active ? 'active neon-text-green' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <main className="animate-fade-in-up">
          {activeTab === 'traffic' && <TrafficModule />}
          {activeTab === 'pollution' && <PollutionModule />}
          {activeTab === 'energy' && <EnergyModule />}
          {activeTab === 'waste' && <WasteModule />}
          {activeTab === 'predictions' && <PredictionModule />}
        </main>

        <footer className="text-center py-4 text-[10px] text-muted-foreground">
          Smart Madurai © 2026 • AI-Powered City Intelligence System • Madurai, Tamil Nadu, India
        </footer>
      </div>
    </div>
  );
}
