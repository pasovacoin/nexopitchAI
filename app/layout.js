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
  title: 'NexopitchAI – Create Client Proposals Instantly',
  description: 'Generate smart, professional proposals with AI in seconds.',
  openGraph: {
    title: 'NexopitchAI – Create Client Proposals Instantly',
    description: 'Generate smart, professional proposals with AI in seconds.',
    url: 'https://nexopitchai.morefestivals.com',
    siteName: 'NexopitchAI',
    images: [
      {
        url: '/og-image.png', // We'll set this up next
        width: 1200,
        height: 630,
        alt: 'NexopitchAI Proposal Generator',
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
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}

