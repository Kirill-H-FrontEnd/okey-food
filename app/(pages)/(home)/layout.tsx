import { Footer } from "@/components/shared/footer/footer";
import { Navbar } from "@/components/shared/navbar/navbar";

import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
const SITE_URL = "https://okey-food.vercel.app";

export const metadata: Metadata = {
  title: "OkeyFood | Доставка здорового питания в Минске",
  description:
    "Доставка здорового питания на дом по всему Минску. Заказывайте вкусные и полезные блюда с доставкой от OkeyFood.",
  keywords:
    "доставка еды, здоровое питание, Минск, OkeyFood, доставка на дом, полезные блюда, еда на заказ, доставка обедов, здоровая еда",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: { "ru-RU": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "OkeyFood",
    title: "OkeyFood | Доставка здорового питания в Минске",
    description:
      "Доставка здорового питания на дом по всему Минску. Заказывайте вкусные и полезные блюда с доставкой от OkeyFood.",
    url: SITE_URL,
    locale: "ru_RU",
    images: [
      {
        url: `${SITE_URL}/okeyfood-logo-png.png`,
        width: 1200,
        height: 630,
        alt: "OkeyFood — доставка здорового питания",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OkeyFood | Доставка здорового питания в Минске",
    description:
      "Доставка здорового питания на дом по всему Минску. Заказывайте вкусные и полезные блюда с доставкой от OkeyFood.",
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
  verification: {
    google: "",
    yandex: "",
  },
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Toaster
          toastOptions={{
            duration: 2000,
            className: " font-semibold text-sm ",

            success: {
              iconTheme: {
                primary: "#00C950",
                secondary: "#fff",
              },
              style: {
                background: "",
                color: "#00C950",
              },
            },

            error: {
              iconTheme: {
                primary: "#FB2C36",
                secondary: "#fff",
              },
              style: {
                color: "#FB2C36",
              },
            },
          }}
        />
        <Footer />
      </div>
    </>
  );
}
