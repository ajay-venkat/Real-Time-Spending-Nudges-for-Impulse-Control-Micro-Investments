
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarLayout } from '@/components/SidebarLayout';

export const metadata: Metadata = {
  title: 'NudgeWealth | Smart Spending & Micro-Investments',
  description: 'Real-time spending behavior analysis and nudge engine for financial empowerment.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <SidebarLayout>
          {children}
        </SidebarLayout>
        <Toaster />
      </body>
    </html>
  );
}
