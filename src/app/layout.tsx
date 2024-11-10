import { Footer } from "@/components/footer";
import Header from "@/components/header";
import "core-js/full/promise/with-resolvers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FreeHunter : Ваш ИИ-агент в поиске работы",
  description:
    "FreeHunter - это ваш персональный помощник в поиске работы. Он поможет вам найти работу, которая вам подходит, и поможет вам сделать карьеру.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
