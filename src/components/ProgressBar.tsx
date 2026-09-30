import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  color = '#3B82F6',
  height = 4,
  className,
  showLabel,
  animated,
}: ProgressBarProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height, backgroundColor: '#1E283D' }}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-700', animated && 'animate-pulse-glow')}
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold num" style={{ color }}>
          {value}
        </span>
      )}
    </div>
  );
}
