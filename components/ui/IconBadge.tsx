import { cn } from '@/lib/cn';

type IconBadgeSize = 'sm' | 'md' | 'lg';
type IconBadgeTone = 'soft' | 'solid' | 'subtle';

const sizeClasses: Record<IconBadgeSize, string> = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
};

const toneClasses: Record<IconBadgeTone, string> = {
  soft: 'bg-accent-soft text-accent',
  solid: 'bg-accent text-surface-raised',
  subtle: 'bg-surface/40 text-foreground',
};

interface IconBadgeProps {
  size?: IconBadgeSize;
  tone?: IconBadgeTone;
  className?: string;
  children?: React.ReactNode;
}

export function IconBadge({ size = 'md', tone = 'soft', className, children }: IconBadgeProps) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-full flex-shrink-0',
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
