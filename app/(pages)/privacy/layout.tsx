import { Footer } from "@/components/shared/footer/footer";
import { Navbar } from "@/components/shared/navbar/navbar";

import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
const SITE_URL = "https://okey-food.vercel.app";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | OkeyFood",
  description:
    "Политика конфиденциальности OkeyFood: какие данные мы собираем при заказе, зачем используем, как храним и как вы можете управлять своими данными.",
  keywords:
    "политика конфиденциальности, okeyfood, персональные данные, доставка еды, минск, cookies, google analytics",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/privacy",
    languages: { "ru-RU": "/privacy" },
  },
  openGraph: {
    type: "website",
    siteName: "OkeyFood",
    title: "Политика конфиденциальности | OkeyFood",
    description:
      "Какие данные мы собираем при заказе и обращениях, как используем cookies и аналитику, и как вы можете управлять своими данными.",
    url: `${SITE_URL}/privacy`,
    locale: "ru_RU",
    images: [
      {
        url: `${SITE_URL}/okeyfood-logo-png.png`,
        width: 1200,
        height: 630,
        alt: "OkeyFood — политика конфиденциальности",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Политика конфиденциальности | OkeyFood",
    description:
      "Какие данные мы собираем при заказе и обращениях, как используем cookies и аналитику, и как вы можете управлять своими данными.",
    images: [`${SITE_URL}/okeyfood-logo-png.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/okeyfood-logo.svg",
    shortcut: "/okeyfood-logo.svg",
    apple: "/okeyfood-logo.svg",
  },
};

export default async function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen text-green-400">
        <Navbar />

        <main className="">{children}</main>
        <Footer />
      </div>
    </>
  );
}
