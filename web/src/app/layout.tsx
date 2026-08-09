import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import ClientLayout from '@/components/layout/ClientLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader' });

export const metadata: Metadata = {
  title: {
    default: 'Enso - Your Quiet Space for Self-Understanding',
    template: '%s | Enso',
  },
  description:
    'An AI-powered wellness companion for reflection, pattern recognition, and gentle growth through daily journaling and meditation.',
  openGraph: {
    title: 'Enso',
    description: 'Your quiet space for self-understanding.',
    url: 'https://ensomode.com',
    siteName: 'Enso',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enso',
    description: 'Your quiet space for self-understanding.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Enso',
              url: 'https://ensomode.com',
              logo: 'https://ensomode.com/logo.png',
              description:
                'An AI-powered wellness companion for reflection and gentle growth.',
            }),
          }}
        />
      </head>
      <body className="font-sans bg-background text-text-primary antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
