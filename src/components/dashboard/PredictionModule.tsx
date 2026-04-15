import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { predictionData } from '@/data/cityData';
import { Brain, TrendingUp } from 'lucide-react';

export default function PredictionModule() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-5 h-5 neon-text-blue" />
        <h2 className="text-lg font-semibold">AI Predictions</h2>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 neon-text-green border border-primary/20">
          Random Forest + Linear Regression
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-4 neon-glow-blue">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Traffic Forecast</h3>
          <p className="text-xs text-muted-foreground mb-3">7-day vehicle count prediction</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={predictionData.traffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff', fontSize: 11 }} />
              <Line type="monotone" dataKey="predicted" stroke="hsl(200, 90%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="Predicted Vehicles" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>Avg Confidence: {(predictionData.traffic.reduce((s, d) => s + d.confidence, 0) / predictionData.traffic.length * 100).toFixed(1)}%</span>
            <span className="neon-text-green">Model: Random Forest</span>
          </div>
        </div>

        <div className="glass-card p-4 neon-glow-green">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Pollution Forecast</h3>
          <p className="text-xs text-muted-foreground mb-3">7-day AQI prediction</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={predictionData.pollution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff', fontSize: 11 }} />
              <Line type="monotone" dataKey="predictedAqi" stroke="hsl(160, 84%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Predicted AQI" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>Avg Confidence: {(predictionData.pollution.reduce((s, d) => s + d.confidence, 0) / predictionData.pollution.length * 100).toFixed(1)}%</span>
            <span className="neon-text-green">Model: Linear Regression</span>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Energy Demand Forecast</h3>
          <p className="text-xs text-muted-foreground mb-3">7-day energy demand prediction</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={predictionData.energy}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(217, 30%, 22%)', borderRadius: 8, color: '#fff', fontSize: 11 }} />
              <Line type="monotone" dataKey="predictedMWh" stroke="hsl(30, 95%, 55%)" strokeWidth={2} dot={{ r: 3 }} name="Predicted MWh" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>Avg Confidence: {(predictionData.energy.reduce((s, d) => s + d.confidence, 0) / predictionData.energy.length * 100).toFixed(1)}%</span>
            <span className="neon-text-orange">Model: Random Forest</span>
          </div>
        </div>
      </div>
    </div>
  );
}
