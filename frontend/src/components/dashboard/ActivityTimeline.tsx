import { Activity } from 'lucide-react';

interface TimelineEntry {
  timestamp: string;
  activity: string;
  confidence: number;
  zone: string;
}

interface Props {
  entries: TimelineEntry[];
}

const activityColors: Record<string, string> = {
  Walking: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Standing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Sitting: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Empty: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  Unknown: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

export default function ActivityTimeline({ entries }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-primary dark:text-white">Activity Timeline</h3>
      </div>
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {entries.slice(0, 10).map((entry, i) => {
          const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          return (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 w-16 shrink-0 tabular-nums">
                {time}
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${activityColors[entry.activity] || activityColors.Unknown}`}>
                {entry.activity}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto tabular-nums">
                {(entry.confidence * 100).toFixed(0)}%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {entry.zone}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
