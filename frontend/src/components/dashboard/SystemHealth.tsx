import { Cpu, HardDrive, Database, Timer } from 'lucide-react';

interface Props {
  cpu: number;
  memory: number;
  dbSize: number;
  uptime: number;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function GaugeBar({ label, value, icon, unit }: { label: string; value: number; icon: React.ReactNode; unit: string }) {
  const color = value > 80 ? 'bg-red-400' : value > 60 ? 'bg-amber-400' : 'bg-emerald-400';

  return (
    <div className="flex items-center gap-3">
      <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{label}</span>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">{value}{unit}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function SystemHealth({ cpu, memory, dbSize, uptime }: Props) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-primary dark:text-white mb-4">System Health</h3>
      <div className="space-y-4">
        <GaugeBar label="CPU Usage" value={cpu} icon={<Cpu className="w-3.5 h-3.5" />} unit="%" />
        <GaugeBar label="Memory" value={memory} icon={<HardDrive className="w-3.5 h-3.5" />} unit="%" />
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Database</span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">{dbSize} MB</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <Timer className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Uptime</span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">{formatUptime(uptime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
