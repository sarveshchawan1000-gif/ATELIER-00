import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { CONFIG } from '@/lib/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MiniBagDrawer } from '@/components/cart/MiniBagDrawer';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { SkipLink } from '@/components/ui/SkipLink';
import { ToastProvider } from '@/components/ui/Toast';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: `${CONFIG.brandName} | Built for the Next Generation`,
    template: `%s | ${CONFIG.brandName}`,
  },
  description: 'ZIPUP NATION — Premium streetwear movement. Built for the next generation. Monolithic silhouettes, heavyweight cotton, and structural street architecture.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: `${CONFIG.brandName} | Built for the Next Generation`,
    description: 'ZIPUP NATION — Premium streetwear movement. Built for the next generation.',
    type: 'website',
    siteName: CONFIG.brandName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CONFIG.brandName} | Built for the Next Generation`,
    description: 'ZIPUP NATION — Premium streetwear movement. Built for the next generation.',
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: CONFIG.brandName,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Premium streetwear movement. Built for the next generation.',
  brand: {
    '@type': 'Brand',
    name: CONFIG.brandName,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-black font-body">
        <ToastProvider>
          <SkipLink />
          <Header />
          <div id="main-content" className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <MiniBagDrawer />
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
