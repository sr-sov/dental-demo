'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement | null;
        prefill?: {
          name?: string;
          email?: string;
          phone?: string;
          customAnswers?: Record<string, string>;
        };
      }) => void;
    };
  }
}

interface CalendlyEmbedProps {
  url: string;
  fallbackUrl?: string;
  prefill?: {
    name?: string;
    email?: string;
    phone?: string;
    customAnswers?: Record<string, string>;
  };
  theme?: 'light' | 'dark';
  onBookingComplete?: () => void;
  onError?: (message: string) => void;
}

export default function CalendlyEmbed({
  url,
  prefill,
  theme = 'light',
  onBookingComplete,
  onError,
}: CalendlyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scriptId = 'calendly-embed-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url,
          parentElement: document.getElementById(`calendly-container-${url}`),
          prefill: prefill
            ? {
                name: prefill.name,
                email: prefill.email,
                phone: prefill.phone,
                customAnswers: prefill.customAnswers,
              }
            : undefined,
        });
        setIsLoading(false);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);

      script.onload = () => {
        initWidget();
      };
    } else {
      if (window.Calendly) {
        initWidget();
      } else {
        script.addEventListener('load', initWidget);
      }
    }

    const handleCalendlyMessage = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        onBookingComplete?.();
      }
      if (
        e.data.event === 'calendly.event_type_not_found' ||
        e.data.event === 'calendly.profile_not_found'
      ) {
        const msg = 'This scheduling link is unavailable. Please try again later or call us directly.';
        setError(msg);
        setIsLoading(false);
        onError?.(msg);
      }
    };

    window.addEventListener('message', handleCalendlyMessage);

    return () => {
      window.removeEventListener('message', handleCalendlyMessage);
      if (script) {
        script.removeEventListener('load', initWidget);
      }
    };
  }, [url, prefill, onBookingComplete, onError]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl border border-line bg-transparent">
      {isLoading && !error && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 animate-pulse transition-opacity duration-300 ${
            theme === 'dark'
              ? 'bg-surface-emphasis text-white/50'
              : 'bg-surface text-foreground-muted'
          }`}
        >
          <div
            className={`h-12 w-12 rounded-full ${
              theme === 'dark' ? 'bg-white/10' : 'bg-surface-alt/50'
            } flex items-center justify-center`}
          >
            🌸
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">
            Securely Loading Dr. Sarah&apos;s Schedule...
          </span>
        </div>
      )}

      {error && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center ${
          theme === 'dark'
            ? 'bg-surface-emphasis text-white/70'
            : 'bg-surface text-foreground-muted'
        }`}>
          <div className="h-12 w-12 rounded-full bg-accent-soft flex items-center justify-center text-accent">
            <span aria-hidden="true">📅</span>
          </div>
          <p className="text-sm font-medium max-w-xs">{error}</p>
          <a
            href="tel:+15875550142"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-[1.05] transition active:scale-[0.98]"
          >
            <span aria-hidden="true">📞</span> Call (587) 555-0142
          </a>
        </div>
      )}

      {!error && (
        <div
          id={`calendly-container-${url}`}
          className="w-full h-full"
          data-testid="calendly-widget"
        />
      )}
    </div>
  );
}
