interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  accent?: boolean;
}

export default function MetricCard({ label, value, unit, icon, trend, accent }: Props) {
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-400' : 'text-slate-400';
  const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '·';

  return (
    <div className={`card flex items-start gap-4 ${accent ? 'border-accent/30 bg-accent/[0.02] dark:bg-accent/[0.04]' : ''}`}>
      <div className={`p-2.5 rounded-lg ${accent ? 'bg-accent/10 text-accent' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold text-primary dark:text-white tabular-nums">{value}</span>
          {unit && <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{unit}</span>}
          {trend && <span className={`text-xs font-medium ${trendColor} ml-1`}>{trendSymbol}</span>}
        </div>
      </div>
    </div>
  );
}
