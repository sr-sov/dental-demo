import type { Metadata } from "next";
import { Sora, Manrope, Crimson_Pro } from "next/font/google";
import SkipNav from "@/components/SkipNav";
import "./globals.css";
import { VercelProviders } from "@/components/VercelProviders";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prairie Oak Dental Studio — South Calgary",
  description:
    "Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies. South Calgary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} ${crimsonPro.variable}`}
    >
      <body>
        <SkipNav />
        <VercelProviders>{children}</VercelProviders>
      </body>
    </html>
  );
}
