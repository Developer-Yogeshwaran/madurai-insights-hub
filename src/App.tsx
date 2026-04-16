import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import MapPage from "./pages/Map.tsx";
import Upload from "./pages/Upload";
import NotFound from "./pages/NotFound.tsx";
import * as React from "react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GlobalRuntimeErrorOverlay />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Upload route removed to revert to pre-upload stage */}
          <Route path="/upload" element={<Upload />} />
          <Route path="/map" element={<MapPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

function GlobalRuntimeErrorOverlay() {
  const [err, setErr] = React.useState<string | null>(null);
  React.useEffect(() => {
    const onErr = (ev: any) => {
      try {
        const msg = ev?.message || ev?.reason || String(ev);
        setErr(msg);
        console.error('Global error caught', ev);
      } catch (e) {
        setErr(String(e));
      }
    };
    const handler = (event: ErrorEvent) => onErr(event.error || event.message || event);
    const rejection = (event: PromiseRejectionEvent) => onErr(event.reason || event);
    window.addEventListener('error', handler as any);
    window.addEventListener('unhandledrejection', rejection as any);
    return () => {
      window.removeEventListener('error', handler as any);
      window.removeEventListener('unhandledrejection', rejection as any);
    };
  }, []);

  if (!err) return null;
  return (
    <div style={{position: 'fixed', inset: 12, zIndex: 9999}}>
      <div style={{background: 'rgba(255,240,240,0.98)', border: '1px solid #f87171', color: '#7f1d1d', padding: 12, borderRadius: 6}}>
        <strong>Runtime Error:</strong>
        <pre style={{whiteSpace: 'pre-wrap', marginTop: 8}}>{String(err)}</pre>
      </div>
    </div>
  );
}
