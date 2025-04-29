import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'NexopitchAI – Smart Business Proposal Generator',
  description: 'Generate high-quality business proposals in seconds using AI. Personalized, downloadable, and easy.',
  keywords: 'AI business proposal, proposal generator, smartpitch, nexopitch, GPT proposal',
  openGraph: {
    title: 'NexopitchAI',
    description: 'Generate stunning business proposals using AI',
    url: 'https://nexopitchai.morefestivals.com',
    siteName: 'nexopitchAI',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'nexopitchAI Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexopitchAI – Create Client Proposals Instantly',
    description: 'Generate smart, professional proposals with AI in seconds.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#25a2eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
