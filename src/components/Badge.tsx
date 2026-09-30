import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  className?: string;
  dot?: boolean;
  glow?: boolean;
}

export function Badge({ children, color, bg, className, dot, glow }: BadgeProps) {
  return (
    <span
      className={cn('status-pill', className)}
      style={{
        color: color ?? '#94A3B8',
        backgroundColor: bg ?? `${color}18` ?? '#1E283D',
        border: `1px solid ${color ?? '#2B3854'}30`,
        boxShadow: glow ? `0 0 8px -2px ${color}60` : undefined,
      }}
    >
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color ?? '#94A3B8' }}
        />
      )}
      {children}
    </span>
  );
}
