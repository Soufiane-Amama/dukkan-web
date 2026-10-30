import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-white p-8 ring-1 ring-stone-200">
      <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
      <p className="mt-2 text-sm text-stone-500">
        حساب تجريبي: <bdi dir="ltr">emilys</bdi> وكلمة المرور <bdi dir="ltr">emilyspass</bdi>
      </p>
      <div className="mt-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-stone-600">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="font-semibold text-teal-800 underline">
          أنشئ حساباً
        </Link>
      </p>
    </div>
  );
}
