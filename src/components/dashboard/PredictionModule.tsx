import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { predictionData } from '@/data/cityData';
import { Brain, TrendingUp } from 'lucide-react';

export default function PredictionModule() {
  return (
    <div className="space-y-4">
      <div className="module-header module-header-predictions mb-2">
        <span className="module-badge" style={{background: 'hsl(270 80% 60%)'}} />
        <Brain className="w-5 h-5 neon-text-purple" />
        <h2>AI Predictions</h2>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 neon-text-green border border-primary/20">
          Random Forest + Linear Regression
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="fancy-card p-4 neon-glow-blue">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Traffic Forecast</h3>
              <p className="text-xs text-muted-foreground mb-3">7-day vehicle count prediction</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold neon-text-blue">12.4k</div>
              <div className="text-xs text-muted-foreground">Est. vehicles</div>
            </div>
          </div>
          <div style={{height:160}} className="mt-3">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={predictionData.traffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff', fontSize: 11 }} />
                <Line type="monotone" dataKey="predicted" stroke="hsl(200, 90%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="Predicted Vehicles" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="fancy-card p-4 neon-glow-green">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Pollution Forecast</h3>
              <p className="text-xs text-muted-foreground mb-3">7-day AQI prediction</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold neon-text-green">Avg 78</div>
              <div className="text-xs text-muted-foreground">AQI</div>
            </div>
          </div>
          <div style={{height:160}} className="mt-3">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={predictionData.pollution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff', fontSize: 11 }} />
                <Line type="monotone" dataKey="predictedAqi" stroke="hsl(160, 84%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Predicted AQI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="fancy-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Energy Demand Forecast</h3>
              <p className="text-xs text-muted-foreground mb-3">7-day energy demand prediction</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold neon-text-orange">24.7MWh</div>
              <div className="text-xs text-muted-foreground">Est. next day</div>
            </div>
          </div>
          <div style={{height:160}} className="mt-3">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={predictionData.energy}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff', fontSize: 11 }} />
                <Line type="monotone" dataKey="predictedMWh" stroke="hsl(30, 95%, 55%)" strokeWidth={2} dot={{ r: 3 }} name="Predicted MWh" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
