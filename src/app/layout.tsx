import type { Metadata } from "next";
import "./globals.css";
// import Link from 'next/link'; // Link 组件仅在已移除的页脚中使用，因此注释掉或删除此行

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
      <body className="antialiased bg-[#0d1117] text-gray-300 flex flex-col min-h-screen">
        <main className="flex-grow">
         {children}
        </main>
        {/* 页脚开始 (此部分被移除) */}
        {/*
        <footer className="bg-[#161b22] text-gray-400 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} AI Baby Podcast. All rights reserved.</p>
            <nav className="flex space-x-4 mt-4 sm:mt-0">
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </footer>
        */}
        {/* 页脚结束 */}
      </body>
    </html>
  );
}