import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "PolicyLens | Grounded Policy Intelligence & Compliance Engine",
    template: "%s | PolicyLens",
  },
  description:
    "PolicyLens transforms complex policies into instant, verifiable answers. Grounded RAG with strict citations, automated compliance auditing, and real-time risk triage.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : new URL("http://localhost:3000"),
  openGraph: {
    title: "PolicyLens | Grounded Policy Intelligence & Compliance Engine",
    description:
      "Transform complex policies into instant, verifiable answers with strict citations and zero hallucinations.",
    type: "website",
    siteName: "PolicyLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolicyLens | Grounded Policy Intelligence",
    description:
      "Transform complex policies into instant, verifiable answers with strict citations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.08),transparent_100%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] text-slate-950 dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent_100%),linear-gradient(180deg,#020617_0%,#0b1120_100%)] dark:text-slate-50 font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}