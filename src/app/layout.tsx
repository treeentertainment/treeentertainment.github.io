import "./globals.css";
import Sidebar from "./components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TREE ENTERTAINMENT",
  description: "TREE ENTERTAINMENT OFFICIAL WEBSITE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen bg-white text-neutral-900">
        {/* ✅ Sidebar 고정 */}
        <Sidebar />

        {/* ✅ 메인 콘텐츠 영역 */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
