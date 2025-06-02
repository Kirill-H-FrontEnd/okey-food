// export const metadata: Metadata = {
//   title: "Kirill H - Web Developer | Next.js, React, TypeScript, Tailwind CSS",
//   description:
//     "Portfolio of Kirill, a web developer specializing in Next.js, React, Tailwind CSS and TypeScript for building modern web applications.",
//   keywords:
//     "web development, Next.js, React, TypeScript, Tailwind, portfolio, freelance, frontend",
//   openGraph: {
//     title:
//       "Kirill H - Web Developer | Next.js, React, TypeScript, Tailwind CSS",
//     description:
//       "Portfolio of Kirill, a web developer specializing in Next.js, React, Tailwind and TypeScript for building modern web applications.",
//     url: "https://kirillh.website",
//     images: [
//       {
//         url: "",
//         width: 800,
//         height: 600,
//         alt: "Kirill's Portfolio",
//       },
//     ],
//     type: "website",
//     siteName: "Kirill's Portfolio",
//   },
// };

import { Footer } from "@/components/shared/footer/footer";
import { Navbar } from "@/components/shared/navbar/navbar";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
