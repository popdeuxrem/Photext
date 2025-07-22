import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/shared/components/ui/toaster';
import localFont from 'next/font/local';

// Correctly load local fonts
const geistSans = localFont({
  src: './fonts/Geist-Regular.woff2',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMono-Regular.woff2',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'phoTextAI - Magic Image Editor',
  description: 'The AI-powered image text editor with vision and inpainting.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="
