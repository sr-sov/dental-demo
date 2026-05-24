import { cn } from '@/lib/cn';

interface TextLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string;
  external?: boolean;
  children?: React.ReactNode;
}

export function TextLink({ href, external = false, className, children, ...props }: TextLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-2 font-display font-semibold text-sm text-foreground border-b border-foreground pb-0.5 hover:gap-4 transition focus-visible:outline-2 focus-visible:outline-accent',
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children} ➔
    </a>
  );
}
