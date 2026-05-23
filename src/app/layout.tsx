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
  title: { default: "데이트립", template: "%s | 데이트립" },
  description: "나만의 데이트 코스를 만들고 공유하세요",
  metadataBase: new URL("https://datetrip-smoky.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "데이트립",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
  },
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
