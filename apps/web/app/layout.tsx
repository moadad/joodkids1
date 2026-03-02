import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import { CartProvider } from "@/components/CartProvider";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "جود كيدز | جملة فقط",
  description: "كتالوج ملابس أطفال — بيع بالجملة فقط (سيري).",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      \1
        <CartProvider>
<Header />
        <main className="flex-1">{children}</main>
        <Footer />
              </CartProvider>
      </body>
    </html>
  );
}
