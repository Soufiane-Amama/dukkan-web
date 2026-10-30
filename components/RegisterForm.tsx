"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const FIELDS = [
  { name: "firstName", label: "الاسم الأول", type: "text", auto: "given-name" },
  { name: "lastName", label: "اسم العائلة", type: "text", auto: "family-name" },
  { name: "username", label: "اسم المستخدم", type: "text", auto: "username", ltr: true },
  { name: "email", label: "البريد الإلكتروني", type: "email", auto: "email", ltr: true },
  { name: "password", label: "كلمة المرور (8 أحرف على الأقل)", type: "password", auto: "new-password", ltr: true },
] as const;

type Name = (typeof FIELDS)[number]["name"];

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/account";
  const [errors, setErrors] = useState<Partial<Record<Name, string>>>({});
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(FIELDS.map((f) => [f.name, String(form.get(f.name) ?? "")])) as Record<Name, string>;
    setSending(true);
    setErrors({});
    setError("");
    try {
      await register(data);
      router.push(next);
    } catch (e) {
      // 400: خطأ تحت كل حقل كما أرسله الخادم، و 409: الاسم أو البريد مستعمل
      if (e instanceof ApiError && e.status === 400 && e.errors.length) {
        setErrors(Object.fromEntries(e.errors.map((x) => [x.field, x.message])));
      } else {
        setError(e instanceof ApiError && e.status < 500 ? e.message : "تعذّر الاتصال. حاول مرة أخرى.");
      }
      setSending(false);
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-stone-300 px-4 py-2.5 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20";
  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {FIELDS.map((f) => (
        <label key={f.name} className="block">
          <span className="text-sm font-medium">{f.label}</span>
          <input
            name={f.name}
            type={f.type}
            required
            autoComplete={f.auto}
            dir={"ltr" in f ? "ltr" : undefined}
            aria-invalid={Boolean(errors[f.name])}
            className={input}
          />
          {errors[f.name] && <span className="mt-1 block text-sm text-rose-700">{errors[f.name]}</span>}
        </label>
      ))}
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
      <button
        disabled={sending}
        className="w-full rounded-full bg-teal-800 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {sending ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
      </button>
    </form>
  );
}
