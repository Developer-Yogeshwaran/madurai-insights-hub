import { type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  glowColor?: 'green' | 'blue' | 'orange' | 'red';
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, glowColor = 'green' }: StatCardProps) {
  const glowClasses = {
    green: 'neon-glow-green',
    blue: 'neon-glow-blue',
    orange: '',
    red: '',
  };
  const textClasses = {
    green: 'neon-text-green',
    blue: 'neon-text-blue',
    orange: 'neon-text-orange',
    red: 'neon-text-red',
  };

  const isNumber = typeof value === 'number';
  const [displayValue, setDisplayValue] = useState<number>(isNumber ? 0 : 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isNumber) return;
    const to = Number(value as number);
    const duration = 900;
    const start = performance.now();
    const from = displayValue || 0;

    const step = (ts: number) => {
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut approx
      const cur = Math.round(from + (to - from) * eased);
      setDisplayValue(cur);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`glass-card-hover p-5 ${glowClasses[glowColor]} animate-fade-in-up card-tilt`}> 
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${textClasses[glowColor]} kpi-number`}>{isNumber ? displayValue : value}</p>
          {subtitle && <p className="text-xs text-muted-foreground kpi-sub">{subtitle}</p>}
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full header-icon-wrap" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          boxShadow: 'inset 0 -6px 18px rgba(0,0,0,0.25), 0 6px 18px rgba(2,6,23,0.5)'
        }}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center`} style={{
            background: 'linear-gradient(135deg, rgba(160,255,200,0.06), rgba(160,200,255,0.06))'
          }}>
            <Icon className={`w-5 h-5 ${textClasses[glowColor]}`} />
          </div>
          <div className="header-ring" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className={trend.positive ? 'neon-text-green' : 'neon-text-red'}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  );
}
