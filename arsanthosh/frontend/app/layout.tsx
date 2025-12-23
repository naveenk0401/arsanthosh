import "./globals.css";

import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
