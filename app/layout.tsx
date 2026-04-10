import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Mulish } from "next/font/google";
import { AnalyticsConsentModal } from "@/components/ui/analytics-consent-modal";
import { Toaster } from "react-hot-toast";
import { CustomToaster } from "@/components/ui/custom-toaster";
import { RationsProvider } from "@/components/providers/rations-provider";

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
        <link rel="icon" href="/logo.png" />
      </head>
      <body style={font.style} className={` antialiased bg-whitePrimary`}>
        <RationsProvider>{children}</RationsProvider>
        <AnalyticsConsentModal />
        <Analytics />

        <CustomToaster />
      </body>
    </html>
  );
}
