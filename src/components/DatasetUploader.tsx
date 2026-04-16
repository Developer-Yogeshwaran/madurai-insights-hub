import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { predictSites } from "@/ml/predictor";

// Minimal Row type for parsed CSV rows
type Row = Record<string, any>;
function parseCSV(text: string): Row[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const row: Row = {};
    for (let j = 0; j < header.length; j++) {
      row[header[j] || `col${j}`] = (cols[j] || "").trim();
    }
    rows.push(row);
  }
  return rows;
}

export default function DatasetUploader() {
  const [preview, setPreview] = React.useState<Row[]>([]);
  const [rowsCount, setRowsCount] = React.useState<number | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [logs, setLogs] = React.useState<string[]>([]);

  const pushLog = (msg: string) => setLogs((s) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...s].slice(0, 50));

  const onFile = (file?: File) => {
    if (!file) return;
    pushLog(`Loading file: ${file.name}`);
    toast({ title: 'Loading file', description: file.name });
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      try {
        const parsed = parseCSV(text);
        setPreview(parsed.slice(0, 10));
        setRowsCount(parsed.length);
        // persist parsed to localStorage for demo usage
        localStorage.setItem("uploadedTelemetry", JSON.stringify(parsed));
        toast({ title: "CSV loaded", description: parsed.length + ' rows stored locally' });
        pushLog(`CSV loaded: ${parsed.length} rows`);

        // Run automatic analysis + predictions
        runAnalysisAndPredict(parsed).catch((e) => pushLog('Analysis error: ' + String(e)));
      } catch (err) {
        toast({ title: "Parse error", description: "Could not parse CSV" });
        pushLog('Parse error: ' + String(err));
      }
    };
    reader.readAsText(file);
  };

  async function runAnalysisAndPredict(parsed: Row[]) {
    // Compute simple numeric stats
    const numericKeys = new Set<string>();
    parsed.forEach((r) => {
      Object.entries(r).forEach(([k, v]) => {
        if (v !== "" && !Number.isNaN(Number(v))) numericKeys.add(k);
      });
    });

    const stats: Record<string, { mean: number; min: number; max: number }> = {};
    numericKeys.forEach((k) => {
      const vals = parsed.map((r) => Number(r[k]) || 0);
      const sum = vals.reduce((a, b) => a + b, 0);
      stats[k] = { mean: sum / vals.length, min: Math.min(...vals), max: Math.max(...vals) };
    });
    pushLog("Uploaded stats: " + JSON.stringify(stats));
    toast({ title: "Analysis complete", description: 'Computed stats for ' + Object.keys(stats).length + ' numeric columns' });

    // Aggregate latest row per site
    const bySite = new Map<string, Row[]>();
    parsed.forEach((r) => {
      const site = r["site"] || "unknown";
      if (!bySite.has(site)) bySite.set(site, []);
      bySite.get(site)!.push(r);
    });

    const latestPerSite = Array.from(bySite.entries()).map(([site, rows]) => {
      rows.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
      const last = rows[rows.length - 1];
      return {
        site,
        pollution: { aqi: Number(last.aqi || last.aqi || 0) },
        traffic: { congestion: Number(last.traffic || 0) },
        energy: { consumption: Number(last.energy || 0) },
        raw: last,
      };
    });

    // Try server predictor first
    const serverUrl = (import.meta.env && (import.meta.env.VITE_PREDICTOR_URL as string)) || (window as any).VITE_PREDICTOR_URL;
    let predictions: any[] = [];
    if (serverUrl) {
      try {
        const clean = serverUrl.replace(/\/+$, "");
        const res = await fetch(clean + '/predict', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sites: latestPerSite }),
        });
        if (res.ok) {
          const json = await res.json();
          predictions = json.predictions || json;
        }
      } catch (e) {
        pushLog("Server predict failed, falling back to client predictor: " + String(e));
      }
    }
    if (predictions.length === 0) {
      // call client-side predictor as fallback
      try {
        pushLog('Calling client predictor');
        const clientPreds = await predictSites(latestPerSite);
        predictions = clientPreds;
      } catch (e) {
        pushLog("Client prediction failed: " + String(e));
        predictions = latestPerSite.map(() => ({ predictedAqi: 0, confidence: 0 }));
      }
    }

    // Merge predictions into preview for quick display (first 10 rows)
    const mergedPreview = parsed.slice(0, 10).map((r, idx) => ({ ...r, predictedAqi: predictions[idx % predictions.length]?.predictedAqi, confidence: predictions[idx % predictions.length]?.confidence }));
    setPreview(mergedPreview as Row[]);
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleClear = () => {
    localStorage.removeItem("uploadedTelemetry");
    setPreview([]);
    setRowsCount(null);
    if (fileRef.current) fileRef.current.value = "";
    toast({ title: "Cleared", description: "Uploaded telemetry cleared" });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Upload telemetry CSV (site,ts,aqi,traffic,bin_fill)</label>
        <div onDrop={handleDrop} onDragOver={handleDragOver} className="p-4 border-dashed rounded-md bg-muted/5">
          <input id="uploader-file-input" ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleChange}
            style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}} />
          <div className="flex items-center gap-3">
            <Button onClick={() => { pushLog('Choose file clicked'); pushLog('fileRef ' + String(fileRef.current)); try { fileRef.current?.click(); } catch (e) { pushLog('Choose file error: ' + String(e)); } }}>Choose file</Button>
            <button type="button" onClick={() => { pushLog('Native Choose file clicked'); try { fileRef.current?.click(); } catch (e) { pushLog('Native choose error: ' + String(e)); } }} className="px-3 py-1 border rounded">Native Choose File</button>
            <Button variant="outline" onClick={async () => {
              pushLog('Load sample clicked');
              try {
                  const res = await fetch('/data/sample_telemetry.csv');
                const text = await res.text();
                const parsed = parseCSV(text);
                setPreview(parsed.slice(0,10));
                setRowsCount(parsed.length);
                localStorage.setItem('uploadedTelemetry', JSON.stringify(parsed));
                toast({ title: 'Sample loaded', description: parsed.length + ' rows stored locally' });
                runAnalysisAndPredict(parsed).catch((e) => pushLog('Analysis error: ' + String(e)));
              } catch (e) {
                pushLog('Sample load failed: ' + String(e));
                toast({ title: 'Sample load failed', description: String(e) });
              }
            }}>Load sample</Button>
            <button type="button" onClick={async () => { pushLog('Native Load sample clicked'); try { const res = await fetch('/data/sample_telemetry.csv'); const text = await res.text(); const parsed = parseCSV(text); setPreview(parsed.slice(0,10)); setRowsCount(parsed.length); localStorage.setItem('uploadedTelemetry', JSON.stringify(parsed)); toast({ title: 'Sample loaded (native)', description: parsed.length + ' rows stored locally' }); runAnalysisAndPredict(parsed).catch((e) => pushLog('Analysis error: ' + String(e))); } catch (e) { pushLog('Native sample failed: ' + String(e)); toast({ title: 'Sample load failed', description: String(e) }); } }} className="px-3 py-1 border rounded">Native Load Sample</button>
            <span className="text-sm text-muted-foreground">or drag & drop CSV here</span>
          </div>
          <div className="mt-2">
            <label className="text-xs">Debug: visible input</label>
            <input id="debug-visible-input" type="file" onChange={(e) => { pushLog('visible input change ' + String(e.target.files)); const f = e.target.files?.[0]; if (f) onFile(f); }} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { const el = fileRef.current; if (el?.files?.[0]) onFile(el.files[0]); }}>
            Load Selected
          </Button>
          <Button variant="outline" onClick={handleClear}>Clear</Button>
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">Rows parsed: {rowsCount ?? 0}</div>
        {preview.length > 0 && (
          <div className="overflow-auto rounded-md border mt-2">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {Object.keys(preview[0]).map((h) => (
                    <th key={h} className="px-2 py-1 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((r, idx) => (
                  <tr key={idx} className={idx % 2 ? "bg-muted/10" : ""}>
                    {Object.keys(preview[0]).map((k) => (
                      <td key={k} className="px-2 py-1">{r[k]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3 p-2 border rounded bg-black/5">
          <div className="text-xs font-medium mb-1">Debug Logs</div>
          <div className="text-xs max-h-40 overflow-auto font-mono bg-white p-2">
            {logs.length === 0 ? <div className="text-muted-foreground">No logs yet</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
