import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/shared/components/ui/toaster';

// Load local fonts correctly
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

// Define the props type explicitly for clarity
type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The Puter.js script is safe to use without 'defer' */}
        <script src="https://cdn.jsdelivr.net/npm/puter/dist/browser.min.js"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
