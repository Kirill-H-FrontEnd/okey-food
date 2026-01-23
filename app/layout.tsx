import "simplebar/dist/simplebar.min.css";
import "./globals.css";

import { Mulish } from "next/font/google";
import { AnalyticsConsentModal } from "@/components/ui/analytics-consent-modal";
import { Navbar } from "@/components/shared/navbar/navbar";
import { Footer } from "@/components/shared/footer/footer";
import { Toaster } from "react-hot-toast";

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
        {/* <Navbar /> */}
        {children}
        <AnalyticsConsentModal />
        <Toaster
          toastOptions={{
            duration: 3000,
            className: " font-medium text-sm ",
            style: {
              borderRadius: "4px",
              padding: "8px 12px",
            },
            success: {
              iconTheme: {
                primary: "#00C950",
                secondary: "#fff",
              },
              style: {
                background: "",
                color: "#05DF72",
              },
            },

            error: {
              iconTheme: {
                primary: "#FB2C36",
                secondary: "#fff",
              },
              style: {
                background: "#fff",
                color: "#FF6467",
              },
            },
          }}
        />
        {/* <Footer /> */}
      </body>
    </html>
  );
}
