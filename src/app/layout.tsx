import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotokaze | AI見積もり",
  description: "フォームに要件を入力するだけで、AIがシステム開発の工数・金額を自動生成。見積もりをメールでお届けします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&family=Noto+Sans+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
