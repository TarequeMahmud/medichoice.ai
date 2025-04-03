import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "MediChoice.AI",
  description: "An AI featured healthcare management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
