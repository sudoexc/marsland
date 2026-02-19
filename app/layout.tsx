import type { Metadata } from "next";
import { Fira_Sans, Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
});

const firaSans = Fira_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Vibe Ramadan Hackathon | MarsHub",
  description:
    "Vibe Ramadan Hackathon — альфа-режим внутри MarsHub. Кодим где удобно, собираем AI-проекты, скоро публикация через MarsHub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${rubik.variable} ${firaSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
