import "@/styles/globals.css";

import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartNotification from "@/components/common/CartNotification";
import CartSidebar from "@/components/layout/CartSidebar";

export const metadata: Metadata = {
  title: "Interior Design & Hardware Store",
  description:
    "Home & Office Interior Design, Modular Kitchen and Premium Hardware Store",
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
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
