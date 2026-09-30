import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  noPad?: boolean;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
}

export function Card({ children, className, elevated, noPad, onClick, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-surface-border',
        elevated ? 'bg-surface-panel shadow-panel' : 'bg-surface',
        !noPad && 'p-4',
        onClick && 'cursor-pointer hover:border-surface-borderLight transition-colors duration-150',
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-[13px] font-semibold text-slate-200 tracking-[-0.01em]', className)}>
      {children}
    </h3>
  );
}
