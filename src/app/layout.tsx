import type { Metadata } from "next";
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

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://sales-agent-jet.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "SalesAgent — AI Sales Agent for Your Website",
    template: "%s | SalesAgent",
  },
  description:
    "Deploy an AI sales agent on your website in minutes. Trained on your business, it qualifies leads, answers questions, and captures emails 24/7 — powered by Claude AI.",
  keywords: [
    "AI sales agent",
    "website chatbot",
    "lead generation",
    "AI lead capture",
    "sales automation",
    "Claude AI",
    "embeddable chat widget",
    "B2B sales tool",
  ],
  authors: [{ name: "SalesAgent" }],
  creator: "SalesAgent",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "SalesAgent",
    title: "SalesAgent — AI Sales Agent for Your Website",
    description:
      "Deploy an AI sales agent on your website in minutes. Qualifies leads, answers questions, and captures emails 24/7.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SalesAgent — AI Sales Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SalesAgent — AI Sales Agent for Your Website",
    description:
      "Deploy an AI sales agent on your website in minutes. Powered by Claude AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
