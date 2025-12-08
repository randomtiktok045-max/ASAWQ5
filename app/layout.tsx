import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import Header from "@/components/Header";
import FooterNav from "@/components/FooterNav";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أسواق سجاد",
  description: "Browse and shop from our wide selection of products across multiple categories. Fast, secure, and convenient online shopping experience.",
  keywords: ["ecommerce", "online shopping", "products", "categories"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} antialiased bg-slate-50`}>
        <CartProvider>
          <Header />
          <div className="pb-20">{children}</div>
          <FooterNav />
        </CartProvider>
      </body>
    </html>
  );
}
