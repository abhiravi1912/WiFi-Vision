import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { generateCSITimeSeries } from '../../services/api';
import { useState, useEffect } from 'react';

export default function CSIWaveform() {
  const [data, setData] = useState(generateCSITimeSeries);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateCSITimeSeries());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-primary dark:text-white">CSI Amplitude</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">64 subcarriers · 20 MHz bandwidth</p>
        </div>
        <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
          LIVE
        </span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--grid-color, #E2E8F0)" strokeOpacity={0.5} />
            <XAxis
              dataKey="index"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              stroke="#94A3B8"
              interval={19}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              stroke="#94A3B8"
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #fff)',
                border: '1px solid var(--tooltip-border, #E2E8F0)',
                borderRadius: '6px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)',
              }}
              labelFormatter={(v) => `Subcarrier ${v}`}
              formatter={(v: number) => [`${v} dB`, 'Amplitude']}
            />
            <Line
              type="monotone"
              dataKey="amplitude"
              stroke="#2563EB"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: '#2563EB' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
