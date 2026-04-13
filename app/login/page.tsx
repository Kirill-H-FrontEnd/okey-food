"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { signIn } from "./actions";
import { ChefHat, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

type LoginField = "email" | "password" | null;

export default function LoginPage() {
  const [state, action, isPending] = useActionState(signIn, null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [activeErrorField, setActiveErrorField] = useState<LoginField>(null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    setActiveErrorField(null);

    if (!email) {
      e.preventDefault();
      setActiveErrorField("email");
      toast.error("Введите email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      setActiveErrorField("email");
      toast.error("Некорректный формат email");
      return;
    }

    if (!password) {
      e.preventDefault();
      setActiveErrorField("password");
      toast.error("Введите пароль");
      return;
    }

    if (password.length < 6) {
      e.preventDefault();
      setActiveErrorField("password");
      toast.error("Пароль должен содержать минимум 6 символов");
      return;
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#302a41] p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#c8f135]/5" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#c8f135]/5" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8f135] shadow-lg">
            <ChefHat className="h-7 w-7 text-[#302a41]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Okey Food</h1>
          <p className="mt-1 text-sm text-white/40">Панель управления</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="mb-6 text-lg font-semibold text-white">Вход</h2>

          <form action={action} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  ref={emailRef}
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="admin@okeyFood.by"
                  aria-invalid={activeErrorField === "email"}
                  className={cn(
                    "w-full rounded-xl border bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/25 transition-colors focus:bg-white/8 focus:outline-none",
                    activeErrorField === "email"
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/10 focus:border-[#c8f135]/50",
                  )}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
                Пароль
              </label>

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  ref={passwordRef}
                  id="login-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={activeErrorField === "password"}
                  className={cn(
                    "w-full rounded-xl border bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/25 transition-colors focus:outline-none",
                    activeErrorField === "password"
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/10 focus:border-[#c8f135]/50",
                  )}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c8f135] py-2.5 font-semibold text-[#302a41] transition-colors hover:bg-[#d4f550] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Входим...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/20">
          Okey Food © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
