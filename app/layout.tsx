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
  metadataBase: new URL('https://prairieoakdental.ca'),
  title: 'Prairie Oak Dental Studio — South Calgary',
  description:
    'Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies. South Calgary.',
  openGraph: {
    title: 'Prairie Oak Dental Studio',
    description:
      'Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies.',
    url: 'https://prairieoakdental.ca',
    siteName: 'Prairie Oak Dental Studio',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prairie Oak Dental Studio',
    description:
      'Modern dentistry that treats you like a person, not a procedure.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: 'Prairie Oak Dental Studio',
  description:
    'Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies.',
  url: 'https://prairieoakdental.ca',
  telephone: '+15875550142',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '14025 Macleod Trail SE',
    addressLocality: 'Calgary',
    addressRegion: 'AB',
    postalCode: 'T2Y 0G6',
    addressCountry: 'CA',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '08:00',
      closes: '16:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '15:00',
    },
  ],
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '312',
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SkipNav />
        <VercelProviders>{children}</VercelProviders>
      </body>
    </html>
  );
}
