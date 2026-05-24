import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-surface-raised shadow-[0_10px_30px_color-mix(in_oklab,var(--color-accent)_25%,transparent)]',
  secondary:
    'bg-surface-raised border border-line text-foreground hover:bg-surface-alt/50',
  ghost:
    'bg-transparent border border-current/20 text-current',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-5 py-3.5 text-sm',
};

const alwaysOn =
  'rounded-xl font-semibold transition active:scale-[0.98] hover:brightness-[1.05] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 inline-flex items-center justify-center gap-2';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(alwaysOn, variantClasses[variant], sizeClasses[size], className);

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { href: _omit, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
