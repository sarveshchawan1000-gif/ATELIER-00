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
    default: `${CONFIG.brandName} | Premium Fashion E-Commerce`,
    template: `%s | ${CONFIG.brandName}`,
  },
  description: 'Architectural garment engineering meets high-contrast editorial curation in India.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
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
