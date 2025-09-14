'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '@/store';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-900 transition-colors text-gray-900 dark:text-gray-100`}
      >
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
