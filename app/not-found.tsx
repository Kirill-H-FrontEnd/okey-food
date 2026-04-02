import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-whitePrimary px-5 py-16">
      <div className="absolute -left-16 top-20 h-44 w-44 rounded-full bg-greenPrimary/10 blur-3xl" />
      <div className="absolute -right-10 bottom-14 h-56 w-56 rounded-full bg-yellowPrimary/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-black/5 bg-white/70 p-8 text-center shadow-sm backdrop-blur">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-greenPrimary/10 text-greenPrimary">
          <SearchX size={30} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-greySecondary">
          Ошибка 404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-colorPrimary sm:text-4xl">
          Страница не найдена
        </h1>
        <p className="mt-3 text-sm text-greySecondary sm:text-base">
          Возможно, ссылка устарела или страница была перемещена. Вернитесь на
          главную и продолжите оформление заказа.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-yellowPrimary px-5 py-3 text-sm font-bold text-colorPrimary transition hover:brightness-95"
          >
            <Home size={16} />
            На главную
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-colorPrimary transition hover:bg-black/5"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </main>
  );
}
