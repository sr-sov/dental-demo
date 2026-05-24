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
  prefill?: {
    name?: string;
    email?: string;
    phone?: string;
    customAnswers?: Record<string, string>;
  };
  theme?: 'light' | 'dark';
  onBookingComplete?: () => void;
}

export default function CalendlyEmbed({
  url,
  prefill,
  theme = 'light',
  onBookingComplete,
}: CalendlyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamic Script Loading with Safe Singleton Check
    const scriptId = 'calendly-embed-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url,
          parentElement: document.getElementById(`calendly-container-${url}`),
          prefill: prefill ? {
            name: prefill.name,
            email: prefill.email,
            phone: prefill.phone,
            customAnswers: prefill.customAnswers,
          } : undefined,
        });
        setIsLoading(false);
      }
    };

    if (!script) {
      // Create script
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      // Create style
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

    // Calendly postMessage event listener for success trigger
    const handleCalendlyMessage = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        if (onBookingComplete) {
          onBookingComplete();
        }
      }
    };

    window.addEventListener('message', handleCalendlyMessage);

    return () => {
      window.removeEventListener('message', handleCalendlyMessage);
      if (script) {
        script.removeEventListener('load', initWidget);
      }
    };
  }, [url, prefill, onBookingComplete]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-wc-line bg-transparent">
      {/* Warm-Clinical Skeleton Pulsing Loader */}
      {isLoading && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 animate-pulse transition-opacity duration-300 ${
            theme === 'dark' ? 'bg-wc-deep text-white/50' : 'bg-wc-surface text-wc-ink-soft'
          }`}
        >
          <div className={`h-12 w-12 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-wc-bg-alt/50'} flex items-center justify-center`}>
            🌸
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">
            Securely Loading Dr. Sarah&apos;s Schedule...
          </span>
        </div>
      )}

      {/* Embedded IFrame Target Container */}
      <div
        id={`calendly-container-${url}`}
        className="w-full h-full"
        data-testid="calendly-widget"
      />
    </div>
  );
}
