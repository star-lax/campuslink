import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-9 h-9 text-[12px]',
  lg: 'w-11 h-11 text-[14px]',
};

export function Avatar({ name, color = '#5A67D8', size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold tracking-wide flex-shrink-0',
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: `${color}25`, color, border: `1px solid ${color}40` }}
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
