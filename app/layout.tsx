import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gumsi.muin.company";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "검시AI - AI 검정고시 튜터 | 24시간 맞춤형 학습",
  description:
    "검정고시 합격의 지름길! AI 튜터와 함께 24시간 언제든지 학습하세요. 맞춤형 문제, 실시간 질문 응답, 학습 분석으로 효율적인 합격 전략을 제시합니다.",
  keywords: [
    "검정고시",
    "AI 튜터",
    "온라인 학습",
    "검정고시 합격",
    "맞춤형 학습",
    "24시간 학습",
  ],
  authors: [{ name: "MUIN" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://gumsi.muin.company",
    title: "검시AI - AI 검정고시 튜터",
    description:
      "검정고시 합격의 지름길! AI 튜터와 함께 24시간 언제든지 학습하세요.",
    siteName: "검시AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "검시AI - AI 검정고시 튜터",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "검시AI - AI 검정고시 튜터",
    description:
      "검정고시 합격의 지름길! AI 튜터와 함께 24시간 언제든지 학습하세요.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
