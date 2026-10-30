"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, placeOrder } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { finalPrice, formatPrice } from "@/lib/format";
import { optimizable } from "@/lib/images";
import type { OrderResponse } from "@/lib/types";

export default function CartView() {
  const { items, ready, total, setQuantity, remove, clear } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderResponse | null>(null);

  async function checkout() {
    if (!user || !token) {
      router.push("/login?next=/cart");
      return;
    }
    setStatus("sending");
    try {
      const result = await placeOrder(
        token,
        user.id,
        items.map(({ id, quantity }) => ({ id, quantity })),
      );
      setOrder(result);
      clear();
      setStatus("idle");
    } catch (e) {
      // الخادم يشرح السبب (مثل نفاد كمية منتج)، فنعرض رسالته كما هي
      setError(e instanceof ApiError && e.status < 500 ? e.message : "تعذّر إرسال الطلب. حاول مرة أخرى.");
      setStatus("error");
    }
  }

  if (order) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-stone-200">
        <p className="text-5xl" aria-hidden="true">
          🎉
        </p>
        <h1 className="mt-4 text-2xl font-bold">تم استلام طلبك!</h1>
        <p className="mt-3 text-stone-600">
          رقم الطلب <bdi>#{order.id}</bdi>، وعدد القطع {order.totalQuantity}، والمجموع{" "}
          <bdi className="font-bold text-teal-900">{formatPrice(order.discountedTotal)}</bdi>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-teal-800 px-6 py-2 text-white hover:bg-teal-700"
          >
            متابعة التسوق
          </Link>
          <Link href="/account" className="rounded-full px-6 py-2 ring-1 ring-stone-300 hover:bg-stone-100">
            عرض طلباتي
          </Link>
        </div>
      </div>
    );
  }

  if (!ready) return <p className="text-stone-500">جارٍ تحميل السلة...</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-stone-200">
        <p className="text-lg">سلتك فارغة.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-teal-800 px-6 py-2 text-white hover:bg-teal-700"
        >
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <ul className="space-y-3 lg:col-span-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-stone-200"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
              <Image
                src={item.thumbnail}
                alt=""
                fill
                unoptimized={!optimizable(item.thumbnail)}
                sizes="80px"
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.id}`}
                className="line-clamp-1 font-semibold hover:text-teal-800"
              >
                <bdi>{item.title}</bdi>
              </Link>
              <p className="text-sm text-stone-500">
                <bdi>{formatPrice(finalPrice(item.price, item.discountPercentage))}</bdi>
              </p>
            </div>
            <div className="flex items-center gap-2" dir="ltr">
              <button
                onClick={() => setQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8 rounded-full ring-1 ring-stone-300 hover:bg-stone-100"
                aria-label="أنقص"
              >
                −
              </button>
              <span className="w-6 text-center" data-testid="qty">
                {item.quantity}
              </span>
              <button
                onClick={() => setQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8 rounded-full ring-1 ring-stone-300 hover:bg-stone-100"
                aria-label="زد"
              >
                +
              </button>
            </div>
            <button
              onClick={() => remove(item.id)}
              className="text-sm text-rose-700 hover:underline"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-stone-200">
        <div className="flex justify-between text-lg">
          <span>المجموع</span>
          <bdi className="font-bold text-teal-900" data-testid="total">
            {formatPrice(total)}
          </bdi>
        </div>
        <button
          onClick={checkout}
          disabled={status === "sending"}
          className="mt-5 w-full rounded-full bg-amber-400 py-3 font-bold text-teal-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {status === "sending"
            ? "جارٍ إرسال الطلب..."
            : user
              ? "أكمل الطلب"
              : "سجّل الدخول لإكمال الطلب"}
        </button>
        {status === "error" && (
          <p className="mt-3 text-sm text-rose-700" role="alert">
            {error}
          </p>
        )}
      </aside>
    </div>
  );
}
