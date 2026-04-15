import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple in-memory EventBus for small cross-component events (realtime updates)
const realtimeBus = new EventTarget();

export function emitRealtimeUpdate(detail: any) {
  realtimeBus.dispatchEvent(new CustomEvent('realtime:update', { detail }));
}

export function onRealtimeUpdate(cb: (detail: any) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail);
  realtimeBus.addEventListener('realtime:update', handler as EventListener);
  return () => realtimeBus.removeEventListener('realtime:update', handler as EventListener);
}

// Notifications helpers (use the same bus but different event name)
export function emitNotification(notification: { title: string; body?: string; level?: 'info'|'warn'|'critical'; ts?: number }) {
  realtimeBus.dispatchEvent(new CustomEvent('realtime:notification', { detail: notification }));
}

export function onNotification(cb: (n: any) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail);
  realtimeBus.addEventListener('realtime:notification', handler as EventListener);
  return () => realtimeBus.removeEventListener('realtime:notification', handler as EventListener);
}
