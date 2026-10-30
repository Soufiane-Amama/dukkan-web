"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";
import OrderStatusBadge from "./OrderStatusBadge";

export default function MyOrders({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getMyOrders(token)
      .then((page) => setOrders(page.orders))
      .catch(() => setFailed(true));
  }, [token]);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">طلباتي</h2>
      {failed ? (
        <p className="mt-4 text-rose-700">تعذّر تحميل طلباتك. حدّث الصفحة.</p>
      ) : !orders ? (
        <p className="mt-4 text-stone-500">جارٍ تحميل طلباتك...</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-stone-600">
          لم تطلب شيئاً بعد.{" "}
          <Link href="/" className="text-teal-800 underline">
            تصفّح المنتجات
          </Link>
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl bg-white p-5 ring-1 ring-stone-200" data-testid="order">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold">
                  طلب <bdi>#{order.id}</bdi>
                </span>
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-stone-500">{formatDate(order.createdAt)}</span>
                <bdi className="ms-auto font-bold text-teal-900">{formatPrice(order.discountedTotal)}</bdi>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                {order.products.map((p, i) => (
                  // bdi لكل اسم: الأسماء الإنجليزية داخل نص عربي لا تختلط مع الكمية والفاصلة
                  <span key={p.id}>
                    {i > 0 && "، "}
                    <bdi>{p.title}</bdi> × {p.quantity}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
