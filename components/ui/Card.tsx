import { cn } from '@/lib/cn';

type CardVariant = 'default' | 'elevated' | 'inset' | 'emphasis';
type CardPadding = 'sm' | 'md' | 'lg';

const variantClasses: Record<CardVariant, string> = {
  default: 'rounded-2xl bg-surface-raised border border-line shadow-sm',
  elevated: 'rounded-2xl bg-surface-raised border border-line shadow-xl',
  inset: 'rounded-2xl bg-surface-alt border border-line',
  emphasis: 'rounded-3xl bg-surface-emphasis text-surface-raised shadow-xl',
};

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
};

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  as: Tag = 'div',
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        interactive && 'hover:translate-y-[-2px] hover:shadow-md transition-all duration-200',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
