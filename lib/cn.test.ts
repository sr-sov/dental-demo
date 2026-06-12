import { cn } from './cn';

describe('cn', () => {
  it('joins multiple class strings', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center');
  });

  it('drops falsy conditional values', () => {
    expect(cn('base', false && 'hidden', undefined, null, 'kept')).toBe('base kept');
  });

  it('supports object syntax for conditional classes', () => {
    expect(cn({ 'is-active': true, 'is-disabled': false })).toBe('is-active');
  });

  it('resolves conflicting Tailwind utilities, last one wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('keeps non-conflicting utilities while resolving conflicts', () => {
    expect(cn('text-sm text-red-500', 'text-blue-500')).toBe('text-sm text-blue-500');
  });
});
