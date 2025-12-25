import "@/styles/globals.css";

import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import CartNotification from "@/components/common/CartNotification";

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
        <CartProvider>
          <CartNotification />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
