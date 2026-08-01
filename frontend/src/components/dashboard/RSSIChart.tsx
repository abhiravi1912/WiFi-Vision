import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { generateRSSITimeSeries } from '../../services/api';
import { useState, useEffect } from 'react';

export default function RSSIChart() {
  const [data, setData] = useState(generateRSSITimeSeries);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          rssi: +(-40 - Math.sin(Date.now() * 0.001) * 8 - Math.random() * 3).toFixed(1),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-primary dark:text-white">RSSI Over Time</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Received Signal Strength Indicator</p>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
          {data[data.length - 1]?.rssi} dBm
        </span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="rssiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              stroke="#94A3B8"
              interval={14}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              stroke="#94A3B8"
              domain={[-65, -30]}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)',
              }}
              formatter={(v: number) => [`${v} dBm`, 'RSSI']}
            />
            <Area
              type="monotone"
              dataKey="rssi"
              stroke="#2563EB"
              strokeWidth={1.5}
              fill="url(#rssiGradient)"
              dot={false}
              activeDot={{ r: 3, fill: '#2563EB' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
