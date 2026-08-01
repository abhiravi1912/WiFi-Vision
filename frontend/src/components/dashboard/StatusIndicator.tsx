interface Props {
  connected: boolean;
  label: string;
  detail?: string;
  size?: 'sm' | 'md';
}

export default function StatusIndicator({ connected, label, detail, size = 'md' }: Props) {
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex items-center justify-center">
        <span
          className={`${dotSize} rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`}
        />
        {connected && (
          <span className="absolute w-4 h-4 rounded-full bg-emerald-400/20 animate-ping" />
        )}
      </span>
      <div>
        <p className={`font-medium text-primary dark:text-white ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {label}
        </p>
        {detail && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{detail}</p>
        )}
      </div>
    </div>
  );
}
