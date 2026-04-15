import { type LucideIcon } from "lucide-react";

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

  return (
    <div className={`glass-card-hover p-5 ${glowClasses[glowColor]} animate-fade-in-up`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${textClasses[glowColor]}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-muted/50`}>
          <Icon className={`w-5 h-5 ${textClasses[glowColor]}`} />
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
