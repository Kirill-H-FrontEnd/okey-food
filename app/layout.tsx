import "simplebar/dist/simplebar.min.css";
import "./globals.css";

import { Mulish } from "next/font/google";

import { InitialLoader } from "@/components/ui/initial-loader";

const font = Mulish({
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
      <head>
        <link rel="canonical" href={`https://okey-food.vercel.app`} />
        <link rel="icon" href="/okeyfood-logo.svg" />
      </head>
      <body style={font.style} className={` antialiased bg-whitePrimary`}>
        <InitialLoader />
        {children}
      </body>
    </html>
  );
}
