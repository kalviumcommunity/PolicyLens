import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PolicyLens | Grounded policy answers",
  description:
    "PolicyLens surfaces policy-grounded answers, source context, and response quality signals for e-commerce teams.",
  metadataBase:
    process.env.NEXT_PUBLIC_SITE_URL !== undefined
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
  openGraph: {
    title: "PolicyLens | Grounded policy answers",
    description:
      "Clear answers. Grounded in policy. PolicyLens surfaces policy-grounded answers with source context.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolicyLens | Grounded policy answers",
    description:
      "Clear answers. Grounded in policy. PolicyLens surfaces policy-grounded answers with source context.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-50 font-sans"
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
