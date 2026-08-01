/* ── Type definitions for WiFi Vision ── */

export interface DeviceStatus {
  id: string;
  name: string;
  role: 'transmitter' | 'receiver';
  connected: boolean;
  port: string | null;
  baudRate: number;
  lastSeen: string | null;
  firmware: string;
  mac: string;
}

export interface CSIDataPoint {
  timestamp: string;
  subcarriers: number[];
  rssi: number;
  noise_floor: number;
  channel: number;
  bandwidth: number;
}

export interface ActivityPrediction {
  activity: string;
  confidence: number;
  zone: string;
  timestamp: string;
  model: string;
}

export interface SystemStatus {
  running: boolean;
  uptime: number;
  packetCount: number;
  predictionCount: number;
  modelLoaded: boolean;
  serialConnected: boolean;
  cpuUsage: number;
  memoryUsage: number;
  dbSize: number;
}

export interface HistoryEntry {
  id: number;
  timestamp: string;
  activity: string;
  confidence: number;
  zone: string;
  rssi: number;
}

export interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  github?: string;
  linkedin?: string;
}

export interface MetricCardData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}
