import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variants = {
  primary: 'bg-cobalt-600 hover:bg-cobalt-500 text-white shadow-sm shadow-cobalt-900/40 border border-cobalt-500/30',
  secondary: 'bg-surface-elevated hover:bg-surface-hover text-slate-200 border border-surface-borderLight',
  ghost: 'hover:bg-surface-panel text-slate-400 hover:text-slate-200 border border-transparent',
  danger: 'bg-electric-coral/10 hover:bg-electric-coral/20 text-electric-coral border border-electric-coral/30',
  outline: 'bg-transparent hover:bg-surface-panel text-slate-300 border border-surface-borderLight hover:border-slate-500',
};

const sizes = {
  xs: 'px-2.5 py-1 text-[11px] gap-1.5 rounded-md',
  sm: 'px-3 py-1.5 text-[12px] gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-[13px] gap-2 rounded-lg',
  lg: 'px-5 py-2.5 text-[14px] gap-2 rounded-xl',
};

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  loading,
  icon,
  iconRight,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1 focus-visible:ring-offset-midnight-900 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : icon}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  );
}
