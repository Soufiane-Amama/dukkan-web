import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = { title: "إنشاء حساب" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-white p-8 ring-1 ring-stone-200">
      <h1 className="text-2xl font-bold">إنشاء حساب</h1>
      <p className="mt-2 text-sm text-stone-500">حساب واحد لطلباتك ومتابعة حالتها.</p>
      <div className="mt-6">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-stone-600">
        لديك حساب؟{" "}
        <Link href="/login" className="font-semibold text-teal-800 underline">
          سجّل الدخول
        </Link>
      </p>
    </div>
  );
}
