"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 rounded-full px-3 py-2 hover:bg-teal-800"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 1.9-1.4L21 8H6.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
      </svg>
      السلة
      {ready && count > 0 && (
        <span
          data-testid="cart-count"
          className="rounded-full bg-amber-400 px-2 text-sm font-bold text-teal-950"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
