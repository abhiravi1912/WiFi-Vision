import { useState, useEffect, useCallback } from 'react';
import { Wifi, Radio, Activity, Target, MapPin, Package, Users, Power } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import StatusIndicator from '../components/dashboard/StatusIndicator';
import CSIWaveform from '../components/dashboard/CSIWaveform';
import RSSIChart from '../components/dashboard/RSSIChart';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import EventsTable from '../components/dashboard/EventsTable';
import SystemHealth from '../components/dashboard/SystemHealth';
import { generateSampleDashboardData } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(generateSampleDashboardData);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refresh = useCallback(() => {
    setData(generateSampleDashboardData());
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, [refresh]);

  const tx = data.devices.find((d) => d.role === 'transmitter');
  const rx = data.devices.find((d) => d.role === 'receiver');

  return (
    <div className="pt-20 pb-12 min-h-screen bg-surface dark:bg-slate-950">
      {/* ── Header bar ── */}
      <div className="border-b border-surface-border dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container-default py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-primary dark:text-white flex items-center gap-2">
              <Wifi className="w-5 h-5 text-accent" />
              Live Dashboard
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Last updated: {lastUpdate.toLocaleTimeString('en-US', { hour12: false })}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <StatusIndicator connected={tx?.connected ?? false} label="Transmitter" detail={tx?.port ?? '—'} size="sm" />
            <StatusIndicator connected={rx?.connected ?? false} label="Receiver" detail={rx?.port ?? '—'} size="sm" />
            <div className="hidden sm:flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${data.status.running ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'}`}>
                <Power className="w-3 h-3" />
                {data.status.running ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-default mt-6 space-y-5">
        {/* ── Metric cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Current RSSI"
            value={data.csi.rssi}
            unit="dBm"
            icon={<Radio className="w-4 h-4" />}
            trend="stable"
          />
          <MetricCard
            label="Predicted Activity"
            value={data.activity.activity}
            icon={<Activity className="w-4 h-4" />}
            accent
          />
          <MetricCard
            label="Confidence"
            value={`${(data.activity.confidence * 100).toFixed(0)}%`}
            icon={<Target className="w-4 h-4" />}
            trend={data.activity.confidence > 0.9 ? 'up' : 'stable'}
          />
          <MetricCard
            label="Detected Zone"
            value={data.activity.zone}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Packet Count"
            value={data.system.packetCount.toLocaleString()}
            icon={<Package className="w-4 h-4" />}
            trend="up"
          />
          <MetricCard
            label="Predictions"
            value={data.system.predictionCount.toLocaleString()}
            icon={<Activity className="w-4 h-4" />}
            trend="up"
          />
          <MetricCard
            label="Occupancy"
            value={data.activity.activity === 'Empty' ? 0 : 1}
            unit="person(s)"
            icon={<Users className="w-4 h-4" />}
          />
          <MetricCard
            label="Channel"
            value={data.csi.channel}
            unit={`· ${data.csi.bandwidth} MHz`}
            icon={<Wifi className="w-4 h-4" />}
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid lg:grid-cols-2 gap-5">
          <CSIWaveform />
          <RSSIChart />
        </div>

        {/* ── Timeline + Health ── */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <ActivityTimeline entries={data.history} />
          </div>
          <SystemHealth
            cpu={data.system.cpuUsage}
            memory={data.system.memoryUsage}
            dbSize={data.system.dbSize}
            uptime={data.status.uptime}
          />
        </div>

        {/* ── Events table ── */}
        <EventsTable events={data.history} />
      </div>
    </div>
  );
}
