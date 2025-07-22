import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/shared/components/ui/toaster';

const geistSans = localFont({
  src: './fonts/Geist-Regular.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = localFont({
  src: './fonts/GeistMono-Regular.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'phoTextAI - Magic Image Editor',
  description: 'The AI-powered image text editor with vision and inpainting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/puter/dist/browser.min.js" async></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
