"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { admin, ApiError, refreshCatalog } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import type { AdminOrder, OrderStatus } from "@/lib/types";
import OrderStatusBadge, { STATUS_LABELS } from "../OrderStatusBadge";

// نفس الانتقالات التي يسمح بها الخادم: نعرض الأزرار الممكنة فقط، والخادم يتحقق مرة أخرى
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const ACTION: Record<OrderStatus, string> = {
  pending: "",
  processing: "ابدأ التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "إلغاء الطلب",
};

const FILTERS: ("" | OrderStatus)[] = ["", "pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const { token } = useAuth();
  const router = useRouter();
  const status = (useSearchParams().get("status") ?? "") as "" | OrderStatus;
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    if (token) admin.orders(token, status).then((r) => setOrders(r.orders)).catch(() => setMessage("تعذّر تحميل الطلبات."));
  }, [token, status]);
  useEffect(load, [load]);

  async function move(order: AdminOrder, next: OrderStatus) {
    if (!token) return;
    try {
      await admin.setOrderStatus(token, order.id, next);
      // الإلغاء يعيد الكميات إلى المخزون، فنحدّث صفحات المتجر أيضاً
      if (next === "cancelled") await refreshCatalog(token);
      setMessage(`الطلب #${order.id}: ${STATUS_LABELS[next]}.`);
      load();
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "تعذّر تحديث الطلب.");
    }
  }

  return (
    <div className="space-y-5">
      <nav aria-label="تصفية الطلبات" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f || "all"}
            onClick={() => router.push(f ? `/admin/orders?status=${f}` : "/admin/orders")}
            aria-pressed={status === f}
            className={`rounded-full px-4 py-1.5 text-sm ring-1 ${status === f ? "bg-teal-800 text-white ring-teal-800" : "ring-stone-300 hover:bg-stone-100"}`}
          >
            {f ? STATUS_LABELS[f] : "الكل"}
          </button>
        ))}
      </nav>

      {message && (
        <p role="status" className="rounded-xl bg-teal-50 px-4 py-2 text-teal-900">
          {message}
        </p>
      )}

      {!orders ? (
        <p className="text-stone-500">جارٍ التحميل...</p>
      ) : orders.length === 0 ? (
        <p className="text-stone-600">لا طلبات هنا.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl bg-white p-5 ring-1 ring-stone-200" data-testid="admin-order">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold">
                  طلب <bdi>#{order.id}</bdi>
                </span>
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-stone-500">{formatDate(order.createdAt)}</span>
                <bdi className="ms-auto font-bold text-teal-900">{formatPrice(order.discountedTotal)}</bdi>
              </div>
              <p className="mt-2 text-sm">
                {order.customer ? (
                  <>
                    <bdi>{order.customer.name}</bdi> · <bdi className="text-stone-500">{order.customer.email}</bdi>
                  </>
                ) : (
                  <span className="text-stone-500">حساب محذوف</span>
                )}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {order.products.map((p, i) => (
                  // bdi لكل اسم: الأسماء الإنجليزية داخل نص عربي لا تختلط مع الكمية والفاصلة
                  <span key={p.id}>
                    {i > 0 && "، "}
                    <bdi>{p.title}</bdi> × {p.quantity}
                  </span>
                ))}
              </p>
              {NEXT[order.status].length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {NEXT[order.status].map((next) => (
                    <button
                      key={next}
                      onClick={() => move(order, next)}
                      className={`rounded-full px-4 py-1.5 text-sm ${next === "cancelled" ? "text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50" : "bg-teal-800 text-white hover:bg-teal-700"}`}
                    >
                      {ACTION[next]}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
