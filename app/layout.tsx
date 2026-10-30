import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";

const readex = Readex_Pro({ subsets: ["arabic", "latin"], variable: "--font-readex" });

export const metadata: Metadata = {
  title: { default: "دُكّان", template: "%s | دُكّان" },
  description: "متجر إلكتروني تعليمي بـ Next.js و TypeScript و Tailwind CSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={readex.variable}>
      <body className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
