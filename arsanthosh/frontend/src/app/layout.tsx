import "@/styles/globals.css";

import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartNotification from "@/components/common/CartNotification";
import CartSidebar from "@/components/layout/CartSidebar";
import NewsletterPopup from "@/components/common/NewsletterPopup";

export const metadata: Metadata = {
  title: "Architect Santhosh",
  description:
    "Home & Office Interior Design, Modular Kitchen and Premium Hardware Store",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <CartNotification />
            <CartSidebar />
            <NewsletterPopup />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
