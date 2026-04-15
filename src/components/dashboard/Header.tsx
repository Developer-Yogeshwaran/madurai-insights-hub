import { Activity, Bell, Clock, SunMoon, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import NotificationsPanel from '@/components/NotificationsPanel';
import { onNotification } from '@/lib/utils';
import { onRealtimeUpdate } from '../../lib/utils';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('theme') as 'dark' | 'light') || 'dark');
  const [accent, setAccentState] = useState<string>(() => localStorage.getItem('accent') || 'green');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onRealtimeUpdate(() => setLastUpdate(Date.now()));
    return unsub;
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('theme', theme);
    localStorage.setItem('accent', accent);
  }, [theme, accent]);

  useEffect(() => {
    const unsub = onNotification(() => setNotifCount((c) => c + 1));
    return unsub;
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    toast({ title: 'Theme updated', description: next === 'dark' ? 'Switched to dark' : 'Switched to light' });
  }

  function pickAccent(a: string) {
    setAccentState(a);
    toast({ title: 'Accent updated', description: `Accent set to ${a}` });
  }

  return (
    <header className="glass-card px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-green" style={{boxShadow: '0 6px 24px rgba(16,24,40,0.6)'}}>
          <Activity className="w-6 h-6 neon-text-green" />
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-3">
            <a href="https://clean-madurai-698f3.web.app/" target="_blank" rel="noopener noreferrer" className="badge-link">
              Clean Madurai
            </a>
            <Link to="/map" className="nav-pill inline-flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Map
            </Link>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Powered City Intelligence</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight mt-1">Smart Madurai</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{time.toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full bg-neon-green ${lastUpdate && Date.now() - lastUpdate < 4000 ? 'animate-ping' : 'animate-pulse'}`} />
          <span className="text-muted-foreground">Live{lastUpdate ? ` · ${Math.max(0, Math.floor((Date.now() - lastUpdate) / 1000))}s` : ''}</span>
        </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} title="Toggle theme" className="p-2 rounded-lg bg-muted/40 hover:bg-muted interactive">
              <SunMoon className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="relative">
              <button onClick={() => { setNotifOpen((v) => !v); setNotifCount(0); }} className="relative p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Bell className="w-4 h-4 text-muted-foreground" />
                {notifCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-neon-red text-[10px] flex items-center justify-center">{notifCount}</span>}
              </button>
              <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
          </div>
      </div>
    </header>
  );
}
