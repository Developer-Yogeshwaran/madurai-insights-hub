import React from 'react';
import { onNotification } from '@/lib/utils';

export default function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    const unsub = onNotification((n) => {
      const withTs = { ts: Date.now(), ...n };
      setItems((s) => [withTs, ...s].slice(0, 50));
    });
    return unsub;
  }, []);

  if (!open) return null;

  return (
    <div className="absolute right-3 top-12 z-50 w-80">
      <div className="glass-card p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">Notifications</h4>
          <button className="text-xs text-muted-foreground" onClick={() => setItems([])}>Clear</button>
        </div>
        <div className="max-h-64 overflow-auto scrollbar-thin space-y-2">
          {items.length === 0 && <div className="text-sm text-muted-foreground">No notifications</div>}
          {items.map((it, i) => (
            <div key={it.ts + i} className="p-2 rounded-md hover:bg-muted/10">
              <div className="text-sm font-medium">{it.title}</div>
              {it.body && <div className="text-xs text-muted-foreground">{it.body}</div>}
              <div className="text-[10px] text-muted-foreground mt-1">{new Date(it.ts).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <button className="nav-pill" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
