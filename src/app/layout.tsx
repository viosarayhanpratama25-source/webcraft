import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebCraft — Jasa Pembuatan Website & Aplikasi Web Profesional",
  description: "Wujudkan website impian Anda bersama WebCraft. Kami melayani pembuatan Landing Page, E-Commerce, Company Profile, dan Aplikasi Web kustom dengan performa maksimal dan desain premium.",
  keywords: "jasa pembuatan website, website development, e-commerce, company profile, webcraft, software agency indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500/30 selection:text-indigo-800">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
