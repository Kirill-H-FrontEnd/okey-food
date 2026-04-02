import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-whitePrimary px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,205,82,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(105,194,120,0.12),transparent_30%)]" />
      <div className="absolute -left-16 top-16 h-44 w-44 rounded-full bg-greenPrimary/10 blur-3xl" />
      <div className="absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-yellowPrimary/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="rounded-[32px] border border-black/5 bg-white/75 p-5 text-center shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8">
          <div className="relative mx-auto mb-6 w-full max-w-[320px] sm:max-w-[380px]">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-yellowPrimary/20 via-transparent to-greenPrimary/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] bg-[#fffdf7]  sm:p-4">
              <Image
                src="/images/404/okey-food-404.png"
                alt="Страница не найдена"
                width={800}
                height={600}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full bg-greenPrimary/10  text-md font-semibold text-greenPrimary text-yellow-hover">
            Ошибка 404
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-colorPrimary sm:text-4xl">
            Страница не найдена
          </h1>

          <p className="mt-3 text-sm leading-7 text-greySecondary sm:text-base">
            Похоже, ссылка устарела, страница была перемещена или такого адреса
            больше не существует. Вернитесь на главную страницу и продолжите
            оформление заказа.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellowPrimary px-5 py-3.5 text-sm font-bold text-colorPrimary transition hover:brightness-95"
            >
              <Home size={17} />
              На главную
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
