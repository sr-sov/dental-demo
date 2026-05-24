import { cn } from '@/lib/cn';

type HeadingTag = 'h1' | 'h2' | 'h3';
type Align = 'left' | 'center';

interface SectionHeaderProps {
  eyebrow?: string;
  as?: HeadingTag;
  align?: Align;
  lede?: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  as: Tag = 'h2',
  align = 'left',
  lede,
  action,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === 'center' && 'text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block mb-3">
          {eyebrow}
        </span>
      )}
      <div className={cn(action && 'flex flex-col md:flex-row md:items-end md:justify-between gap-4')}>
        <div>
          <Tag className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty leading-tight">
            {children}
          </Tag>
          {lede && (
            <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
              {lede}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
