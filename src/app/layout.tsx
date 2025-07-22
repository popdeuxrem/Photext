import type { Metadata } from 'next';
import './globals.css'; // This import should now work
import { Toaster } from '@/shared/components/ui/toaster';

export const metadata: Metadata = {
  title: 'phoTextAI - Magic Image Editor',
  description: 'The AI-powered image text editor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/puter/dist/browser.min.js"></script>
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
