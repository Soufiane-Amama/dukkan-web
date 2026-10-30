"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function UserMenu() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? (
    <>
      {user.role === "admin" && (
        <Link href="/admin" className="rounded-full px-3 py-2 font-semibold text-amber-300 hover:bg-teal-800">
          لوحة المتجر
        </Link>
      )}
      <Link href="/account" className="rounded-full px-3 py-2 hover:bg-teal-800">
        مرحباً، {user.firstName}
      </Link>
    </>
  ) : (
    <Link href="/login" className="rounded-full px-3 py-2 hover:bg-teal-800">
      تسجيل الدخول
    </Link>
  );
}
