// app/layout.tsx
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';
import { cn } from '@/lib/utils';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Sistema de Gestão Ambiental e Social',
  description:
    'Plataforma para gestão de projetos de infraestrutura de água e saneamento',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='pt' suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
