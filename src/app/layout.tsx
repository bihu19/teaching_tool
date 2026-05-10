import type { Metadata } from "next";
import { Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { LangProvider } from "@/components/LangContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Puay Teach — เครื่องมือการเรียนรู้",
  description: "เครื่องมือการเรียนรู้วิชาคณิตศาสตร์และวิทยาศาสตร์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`h-full antialiased ${manrope.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex bg-[var(--background)] text-[var(--foreground)]">
        <LangProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
