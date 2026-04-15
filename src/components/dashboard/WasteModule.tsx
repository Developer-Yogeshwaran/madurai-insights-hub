import { wasteBins, cleanlinessScores, getBinStatus } from '@/data/cityData';
import { Trash2, Recycle, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatCard from './StatCard';

export default function WasteModule() {
  const criticalBins = wasteBins.filter(b => b.fill >= 90).length;
  const avgFill = Math.round(wasteBins.reduce((s, b) => s + b.fill, 0) / wasteBins.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Recycle className="w-5 h-5 neon-text-green" />
        <h2 className="text-lg font-semibold">Waste Management</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="Smart Bins" value={wasteBins.length} subtitle="Active sensors" icon={Trash2} glowColor="green" />
        <StatCard title="Critical Bins" value={criticalBins} subtitle="Need collection" icon={MapPin} glowColor="red" />
        <StatCard title="Avg Fill Level" value={`${avgFill}%`} icon={Recycle} glowColor="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Smart Bin Status</h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
            {wasteBins.sort((a, b) => b.fill - a.fill).map(bin => {
              const status = getBinStatus(bin.fill);
              return (
                <div key={bin.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Trash2 className={`w-4 h-4 ${status.colorClass}`} />
                    <div>
                      <p className="text-xs font-medium">{bin.area}</p>
                      <p className="text-[10px] text-muted-foreground">{bin.type} • {bin.lastCollected}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${bin.fill}%`,
                          backgroundColor: bin.fill >= 90 ? 'hsl(0, 85%, 55%)' : bin.fill >= 70 ? 'hsl(30, 95%, 55%)' : 'hsl(160, 84%, 45%)',
                        }}
                      />
                    </div>
                    <span className={`text-xs font-mono ${status.colorClass}`}>{bin.fill}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Area Cleanliness Score</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cleanlinessScores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis dataKey="area" type="category" tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} width={110} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {cleanlinessScores.map((entry, i) => (
                  <Cell key={i} fill={entry.score >= 80 ? 'hsl(160, 84%, 45%)' : entry.score >= 60 ? 'hsl(200, 90%, 50%)' : 'hsl(30, 95%, 55%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
