import { Activity, Bell, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass-card px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-green">
          <Activity className="w-5 h-5 neon-text-green" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            Smart Madurai
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">AI Powered City Intelligence System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{time.toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-muted-foreground">Live</span>
        </div>
        <button className="relative p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-red text-[8px] flex items-center justify-center">3</span>
        </button>
      </div>
    </header>
  );
}
