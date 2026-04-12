"use client";
import { useActionState, useEffect, useRef } from "react";
import { signIn } from "./actions";
import { ChefHat, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(signIn, null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    if (!email) {
      e.preventDefault();
      toast.error("Введите email");
      emailRef.current?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      toast.error("Некорректный формат email");
      emailRef.current?.focus();
      return;
    }

    if (!password) {
      e.preventDefault();
      toast.error("Введите пароль");
      passwordRef.current?.focus();
      return;
    }

    if (password.length < 6) {
      e.preventDefault();
      toast.error("Пароль должен содержать минимум 6 символов");
      passwordRef.current?.focus();
      return;
    }
  }

  return (
    <div className="min-h-dvh bg-[#302a41] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#c8f135]/5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#c8f135]/5" />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#c8f135] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <ChefHat className="w-7 h-7 text-[#302a41]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Okey Food</h1>
          <p className="text-white/40 text-sm mt-1">Панель управления</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Вход</h2>

          <form action={action} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="admin@okeyFood.by"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#c8f135]/50 focus:bg-white/8 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Пароль
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#c8f135]/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#c8f135] hover:bg-[#d4f550] disabled:opacity-60 disabled:cursor-not-allowed text-[#302a41] font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
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

        <p className="text-center text-white/20 text-xs mt-6">
          Okey Food © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
