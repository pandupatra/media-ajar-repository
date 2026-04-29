import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Media Pembelajaran PTP - Platform Belajar Online",
  description: "Temukan berbagai media pembelajaran berkualitas untuk guru dan murid. E-book, video, PDF, dan materi interaktif dalam satu platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${lexend.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-contrast focus:text-sm focus:outline-none">
          Langsung ke konten
        </a>
        {children}
      </body>
    </html>
  );
}