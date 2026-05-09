import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mind Bridge - Ухаалаг Фриланс Платформ",
  description: "AI технологиор баяжуулсан Монголын анхны фрилансеруудын ухаалаг платформ.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


