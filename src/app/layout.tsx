import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Blog",
  description: "Next.js + Markdown + Tailwind Blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
