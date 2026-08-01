import { Clock } from 'lucide-react';

interface Event {
  id: number;
  timestamp: string;
  activity: string;
  confidence: number;
  zone: string;
  rssi: number;
}

interface Props {
  events: Event[];
}

export default function EventsTable({ events }: Props) {
  return (
    <div className="card p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-primary dark:text-white">Recent Events</h3>
        <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-500">{events.length} records</span>
      </div>
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="border-b border-surface-border dark:border-slate-800">
              <th className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2.5 pr-4">Time</th>
              <th className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2.5 pr-4">Activity</th>
              <th className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2.5 pr-4">Confidence</th>
              <th className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2.5 pr-4">Zone</th>
              <th className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2.5">RSSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border dark:divide-slate-800">
            {events.slice(0, 8).map((event) => {
              const time = new Date(event.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              });
              return (
                <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 pr-4 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">{time}</td>
                  <td className="py-2.5 pr-4 text-xs font-medium text-primary dark:text-white">{event.activity}</td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${event.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">{(event.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-slate-500 dark:text-slate-400">{event.zone}</td>
                  <td className="py-2.5 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">{event.rssi} dBm</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
