import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "@/components/providers/SessionProvider"
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "데이트립",
  description: "나만의 데이트 코스를 만들고 공유하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={geistMono.variable}>
      <body className="min-h-full flex flex-col font-sans antialiased">
          <SessionProvider>{children}</SessionProvider>
          <Toaster position="bottom-center" richColors />
        </body>
    </html>
  );
}
