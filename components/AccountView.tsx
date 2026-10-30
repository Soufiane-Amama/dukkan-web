"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import MyOrders from "./MyOrders";

export default function AccountView() {
  const { user, token, ready, logout } = useAuth();
  if (!ready) return <p className="text-stone-500">جارٍ التحقق من حسابك...</p>;
  if (!user) {
    return (
      <p>
        هذه الصفحة لأصحاب الحسابات.{" "}
        <Link href="/login?next=/account" className="text-teal-800 underline">
          سجّل الدخول
        </Link>
      </p>
    );
  }
  return (
    <>
    <div className="flex flex-wrap items-center gap-6 rounded-3xl bg-white p-8 ring-1 ring-stone-200">
      {/* unoptimized: الصورة الشخصية من نطاق غير الموجود في next.config.mjs، فنعرضها كما هي */}
      <Image
        src={user.image || "/avatar.svg"}
        alt=""
        width={96}
        height={96}
        unoptimized
        className="rounded-full bg-stone-100"
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold">
          <bdi>
            {user.firstName} {user.lastName}
          </bdi>
        </h1>
        <p className="mt-1 text-stone-500">
          <bdi>{user.email}</bdi>
        </p>
      </div>
      <button
        onClick={logout}
        className="rounded-full px-5 py-2 ring-1 ring-stone-300 hover:bg-stone-100"
      >
        تسجيل الخروج
      </button>
    </div>
    {token && <MyOrders token={token} />}
    </>
  );
}
