import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";

export const metadata: Metadata = {
  title: "Block Memory Game",
  description: "https://github.com/EminJ",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className + " bg-white"}>
        {children}
      </body>
    </html>
  );
}