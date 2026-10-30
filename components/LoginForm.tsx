"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/account";
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      await login(String(form.get("username")), String(form.get("password")));
      router.push(next);
    } catch (e) {
      // 400 من DummyJSON تعني اسم مستخدم أو كلمة مرور خاطئة
      setError(
        e instanceof ApiError && e.status === 400
          ? "اسم المستخدم أو كلمة المرور غير صحيحة."
          : "تعذّر الاتصال. حاول مرة أخرى.",
      );
      setSending(false);
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-stone-300 px-4 py-2.5 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20";
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        اسم المستخدم
        <input name="username" required dir="ltr" autoComplete="username" className={input} />
      </label>
      <label className="block">
        كلمة المرور
        <input
          name="password"
          type="password"
          required
          dir="ltr"
          autoComplete="current-password"
          className={input}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
      <button
        disabled={sending}
        className="w-full rounded-full bg-teal-800 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {sending ? "جارٍ الدخول..." : "دخول"}
      </button>
    </form>
  );
}
