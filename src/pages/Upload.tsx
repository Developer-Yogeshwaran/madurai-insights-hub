import React, { useState } from "react";
const DatasetUploader = React.lazy(() => import("@/components/DatasetUploader"));
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export default function Upload() {
  const [showPreview, setShowPreview] = useState(true);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Upload Telemetry CSV</h1>
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/map">
            <Button variant="outline">Open Map</Button>
          </Link>
          <Button onClick={() => window.open('https://back-vert-three.vercel.app/', '_blank', 'noopener')}>Open External</Button>
          <Button variant="outline" onClick={() => setShowPreview((s) => !s)}>{showPreview ? 'Hide Preview' : 'Show Preview'}</Button>
          <Button onClick={() => window.open('http://localhost:5173', '_blank', 'noopener')}>Open Localhost</Button>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <ErrorBoundary>
          <React.Suspense fallback={<div className="p-6">Loading uploader...</div>}>
            <DatasetUploader />
          </React.Suspense>
        </ErrorBoundary>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2 rounded-md border p-3 bg-white/5">
          <h3 className="text-sm font-medium mb-2">AQI Over Time (avg)</h3>
          <ChartContainer id="aqi-time" config={{ avgAqi: { label: 'Avg AQI', color: 'var(--color-primary, #22c55e)' } }}>
            <LineChart data={[]} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" tickFormatter={(v) => new Date(v).toLocaleTimeString()} />
              <YAxis />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="avgAqi" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="rounded-md border p-3 bg-white/5">
          <h3 className="text-sm font-medium mb-2">Traffic Distribution</h3>
          <ChartContainer id="traffic-hist" config={{ count: { label: 'Count', color: '#3b82f6' } }}>
            <BarChart data={[]} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="col-span-1 md:col-span-3 rounded-md border p-3 bg-white/5">
          <h3 className="text-sm font-medium mb-2">Bin Fill Over Time (avg)</h3>
          <ChartContainer id="bin-time" config={{ avgBin: { label: 'Avg Bin Fill', color: '#f59e0b' } }}>
            <LineChart data={[]} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" tickFormatter={(v) => new Date(v).toLocaleTimeString()} />
              <YAxis />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="avgBin" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Uploaded CSV is parsed client-side and saved to localStorage (key: <strong>uploadedTelemetry</strong>) for demo use. Charts update when a CSV is uploaded.
      </div>
      {showPreview && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">External Upload Preview</h3>
          <div className="rounded-md border overflow-hidden">
            <iframe src="https://back-vert-three.vercel.app/" title="External Upload Preview" className="w-full h-[600px] border-0" />
          </div>
        </div>
      )}
    </div>
  );
}
