/**
 * API service for communicating with the WiFi Vision Flask backend.
 * Falls back to sample data when the backend is unavailable.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  /* ── Status ── */
  getStatus: () => request<{ running: boolean; uptime: number }>('/status'),
  getDevices: () => request<{ devices: Array<{ id: string; name: string; role: string; connected: boolean }> }>('/devices'),
  getSystem: () => request<{ cpu: number; memory: number; db_size: number; packet_count: number }>('/system'),

  /* ── CSI Data ── */
  getLatestCSI: () => request<{ csi: { subcarriers: number[]; rssi: number; timestamp: string } }>('/csi/latest'),

  /* ── Activity ── */
  getActivity: () => request<{ activity: string; confidence: number; zone: string; timestamp: string }>('/activity'),
  getHistory: (limit = 50) => request<{ history: Array<{ id: number; timestamp: string; activity: string; confidence: number; zone: string; rssi: number }> }>(`/history?limit=${limit}`),

  /* ── Controls ── */
  start: () => request<{ message: string }>('/start', { method: 'POST' }),
  stop: () => request<{ message: string }>('/stop', { method: 'POST' }),
  train: (data?: FormData) =>
    fetch(`${API_BASE}/train`, { method: 'POST', body: data }).then((r) => r.json()),
  predict: (features: number[]) =>
    request<{ prediction: string; confidence: number }>('/predict', {
      method: 'POST',
      body: JSON.stringify({ features }),
    }),
};

/* ── Sample data generators for when the backend is offline ── */

function generateCSISubcarriers(count = 64): number[] {
  return Array.from({ length: count }, (_, i) => {
    const base = 15 + 10 * Math.sin((i / count) * Math.PI * 2);
    return +(base + (Math.random() - 0.5) * 4).toFixed(1);
  });
}

const ACTIVITIES = ['Walking', 'Standing', 'Sitting', 'Empty', 'Unknown'];
const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

export function generateSampleDashboardData() {
  const now = new Date();
  const rssiBase = -42 + Math.random() * 8;

  return {
    status: { running: true, uptime: 3847 },
    devices: [
      { id: 'tx-01', name: 'ESP32 Transmitter', role: 'transmitter', connected: true, port: 'COM3', mac: '24:6F:28:A1:B2:C3' },
      { id: 'rx-01', name: 'ESP32 Receiver', role: 'receiver', connected: true, port: 'COM4', mac: '24:6F:28:D4:E5:F6' },
    ],
    csi: {
      subcarriers: generateCSISubcarriers(),
      rssi: +rssiBase.toFixed(1),
      noiseFloor: -90 + Math.random() * 5,
      timestamp: now.toISOString(),
      channel: 6,
      bandwidth: 20,
    },
    activity: {
      activity: ACTIVITIES[Math.floor(Math.random() * 3)],
      confidence: +(0.82 + Math.random() * 0.15).toFixed(2),
      zone: ZONES[Math.floor(Math.random() * ZONES.length)],
      timestamp: now.toISOString(),
      model: 'RandomForest',
    },
    system: {
      cpuUsage: +(12 + Math.random() * 20).toFixed(1),
      memoryUsage: +(35 + Math.random() * 15).toFixed(1),
      dbSize: 2.4,
      packetCount: 14832 + Math.floor(Math.random() * 100),
      predictionCount: 7416 + Math.floor(Math.random() * 50),
    },
    history: Array.from({ length: 20 }, (_, i) => ({
      id: 20 - i,
      timestamp: new Date(now.getTime() - i * 30000).toISOString(),
      activity: ACTIVITIES[Math.floor(Math.random() * 3)],
      confidence: +(0.78 + Math.random() * 0.2).toFixed(2),
      zone: ZONES[Math.floor(Math.random() * ZONES.length)],
      rssi: +(-38 - Math.random() * 15).toFixed(1),
    })),
  };
}

export function generateRSSITimeSeries(points = 60): { time: string; rssi: number }[] {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 2000).toLocaleTimeString('en-US', { hour12: false }),
    rssi: +(-40 - Math.sin(i * 0.15) * 8 - Math.random() * 3).toFixed(1),
  }));
}

export function generateCSITimeSeries(points = 100): { index: number; amplitude: number }[] {
  return Array.from({ length: points }, (_, i) => ({
    index: i,
    amplitude: +(15 + 10 * Math.sin((i / 100) * Math.PI * 4) + (Math.random() - 0.5) * 5).toFixed(1),
  }));
}
