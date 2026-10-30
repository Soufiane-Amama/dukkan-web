"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { admin } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import type { OrderStatus, Stats } from "@/lib/types";
import OrderStatusBadge from "../OrderStatusBadge";

export default function AdminStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (token) admin.stats(token).then(setStats).catch(() => setFailed(true));
  }, [token]);

  if (failed) return <p className="text-rose-700">تعذّر تحميل الأرقام.</p>;
  if (!stats) return <p className="text-stone-500">جارٍ التحميل...</p>;

  const cards = [
    { label: "الإيرادات", value: formatPrice(stats.revenue), note: "بلا الطلبات الملغاة" },
    { label: "الطلبات", value: stats.orders },
    { label: "الزبائن", value: stats.customers },
    { label: "المنتجات", value: stats.products },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 ring-1 ring-stone-200" data-testid={`stat-${c.label}`}>
            <p className="text-sm text-stone-500">{c.label}</p>
            <bdi className="mt-1 block text-2xl font-bold text-teal-900">{c.value}</bdi>
            {c.note && <p className="mt-1 text-xs text-stone-400">{c.note}</p>}
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-bold">الطلبات حسب الحالة</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {(Object.entries(stats.ordersByStatus) as [OrderStatus, number][]).map(([status, count]) => (
            <Link
              key={status}
              href={`/admin/orders?status=${status}`}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-stone-200 hover:ring-teal-700"
            >
              <OrderStatusBadge status={status} />
              <bdi className="font-bold">{count}</bdi>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold">مخزون منخفض</h2>
        {stats.lowStock.length === 0 ? (
          <p className="mt-3 text-stone-600">كل المنتجات متوفرة بكميات كافية.</p>
        ) : (
          <ul className="mt-3 divide-y divide-stone-200 rounded-2xl bg-white ring-1 ring-stone-200">
            {stats.lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <bdi className="flex-1">{p.title}</bdi>
                <span className={p.stock === 0 ? "font-bold text-rose-700" : "text-amber-700"}>
                  {p.stock === 0 ? "نفد" : `بقي ${p.stock}`}
                </span>
                <Link href={`/admin/products/${p.id}`} className="text-sm text-teal-800 underline">
                  تعديل
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
