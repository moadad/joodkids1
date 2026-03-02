import "./globals.css";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import CartProvider from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "جود كيدز | Jood Kids",
  description: "ملابس أطفال جملة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen bg-white">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}