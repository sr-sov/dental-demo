"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";

export function VercelProviders({ children }: { children: ReactNode }) {
  // Vercel script injection only works on Vercel's platform.
  // In local dev/CI, the scripts 404 and log console errors.
  const isVercel =
    process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined ||
    process.env.VERCEL !== undefined;

  if (!isVercel) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
