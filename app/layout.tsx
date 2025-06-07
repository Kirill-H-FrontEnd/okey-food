import type { Metadata } from "next";
import "simplebar/dist/simplebar.min.css";
import "./globals.css";

import { Mulish } from "next/font/google";

const geist = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body style={geist.style} className={` antialiased`}>
        {children}
      </body>
    </html>
  );
}
