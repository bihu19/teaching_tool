import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { LangProvider } from "@/components/LangContext";

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
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex">
        <LangProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
