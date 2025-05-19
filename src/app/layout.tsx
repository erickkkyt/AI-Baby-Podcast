import type { Metadata } from "next";
import "./globals.css";

// TODO: 更新 metadata 以匹配 AI Baby Podcast 主题
export const metadata: Metadata = {
  title: "AI Baby Podcast Generator", // 示例新标题
  description: "Create, optimize, and monetize AI-powered baby podcast videos.", // 示例新描述
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      {/* 应用新的字体变量到 body */}
      <body className="antialiased">

        {children}
      </body>
    </html>
  );
}