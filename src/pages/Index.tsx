import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import TrafficModule from '@/components/dashboard/TrafficModule';
import PollutionModule from '@/components/dashboard/PollutionModule';
import EnergyModule from '@/components/dashboard/EnergyModule';
import WasteModule from '@/components/dashboard/WasteModule';
import PredictionModule from '@/components/dashboard/PredictionModule';
import CityMap from '@/components/dashboard/CityMap';
import { Car, Wind, Zap, Recycle, Brain, MapPin } from 'lucide-react';

const tabs = [
  { id: 'traffic', label: 'Traffic', icon: Car },
  { id: 'pollution', label: 'Pollution', icon: Wind },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'waste', label: 'Waste', icon: Recycle },
  { id: 'predictions', label: 'AI Predictions', icon: Brain },
  { id: 'map', label: 'City Map', icon: MapPin },
] as const;

type TabId = typeof tabs[number]['id'];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>('traffic');

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <Header />

        <nav className="glass-card p-1.5 flex gap-1 overflow-x-auto scrollbar-thin">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-primary/15 neon-text-green'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
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
          {activeTab === 'map' && <CityMap />}
        </main>

        <footer className="text-center py-4 text-[10px] text-muted-foreground">
          Smart Madurai © 2026 • AI-Powered City Intelligence System • Madurai, Tamil Nadu, India
        </footer>
      </div>
    </div>
  );
}
