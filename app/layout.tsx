import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ניהול משימות",
    template: "%s | ניהול משימות",
  },
  description: "ניהול פרויקטים ומשימות בצורה פשוטה וחכמה — Hebrew-first collaborative workspace",
  keywords: ["ניהול משימות", "פרויקטים", "Kanban", "RTL", "Hebrew"],
  openGraph: {
    title: "מערכת ניהול משימות",
    description: "ניהול פרויקטים ומשימות בצורה פשוטה וחכמה",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full bg-cream antialiased">{children}</body>
    </html>
  );
}
