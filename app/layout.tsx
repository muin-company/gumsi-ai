import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "검시AI - AI 검정고시 튜터",
  description: "24시간 실시간 AI 기반 검정고시 학습 도우미",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
