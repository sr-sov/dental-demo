'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

interface DisclosureProps {
  summary: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Disclosure({
  summary,
  open,
  onOpenChange,
  id: externalId,
  className,
  children,
}: DisclosureProps) {
  const generatedId = useId();
  const panelId = externalId ?? generatedId;

  return (
    <div className={cn('py-4', className)}>
      <button
        onClick={() => onOpenChange(!open)}
        className="w-full flex items-center justify-between text-left gap-4 py-2 font-serif text-lg font-semibold text-foreground focus-visible:outline-accent cursor-pointer"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>{summary}</span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/40 text-foreground transition-transform duration-200 flex-shrink-0"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)' }}
        >
          ➕
        </span>
      </button>

      <div
        id={panelId}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '200px' : '0',
          opacity: open ? 1 : 0,
        }}
      >
        <div className="text-sm leading-relaxed text-foreground-muted pt-2 pb-4 pr-10">
          {children}
        </div>
      </div>
    </div>
  );
}
