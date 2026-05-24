import { cn } from '@/lib/cn';

type SectionVariant = 'default' | 'alt' | 'emphasis';
type SectionSize = 'default' | 'compact' | 'tight';
type SectionTag = 'section' | 'header' | 'footer' | 'aside' | 'div';

interface SectionProps {
  id?: string;
  as?: SectionTag;
  variant?: SectionVariant;
  size?: SectionSize;
  className?: string;
  children?: React.ReactNode;
}

const variantClasses: Record<SectionVariant, string> = {
  default: 'bg-surface',
  alt: 'bg-surface-alt',
  emphasis: 'bg-surface-emphasis text-surface-raised',
};

const sizeClasses: Record<SectionSize, string> = {
  default: 'py-14 lg:py-20',
  compact: 'py-10 lg:py-16',
  tight: 'py-8 lg:py-12',
};

export function Section({
  id,
  as: Tag = 'section',
  variant = 'default',
  size = 'default',
  className,
  children,
}: SectionProps) {
  return (
    <Tag id={id} className={cn(variantClasses[variant], sizeClasses[size], className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {children}
      </div>
    </Tag>
  );
}
