import { Footer } from "@/components/shared/footer/footer";
import { Navbar } from "@/components/shared/navbar/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OkeyFood | Доставка здорового питания в Минске",
  description:
    "Досставка здорового питания на дом и по всему Минску. Заказывайте вкусные и полезные блюда с доставкой от OkeyFood.",
  keywords:
    "доставка еды, здоровое питание, Минск, OkeyFood, доставка на дом, полезные блюда, еда на заказ, доставка обедов, здоровая еда, ресторанная доставка",
  openGraph: {
    title: "OkeyFood | Доставка здорового питания в Минске",
    description:
      "Досставка здорового питания на дом и по всему Минску. Заказывайте вкусные и полезные блюда с доставкой от OkeyFood.",
    url: "",
    images: [
      {
        url: "",
        width: 800,
        height: 600,
        alt: "OkeyFood",
      },
    ],
    type: "website",
    siteName: "OkeyFood",
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
        <Footer />
      </div>
    </>
  );
}
