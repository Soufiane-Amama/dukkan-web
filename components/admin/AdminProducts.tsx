"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { admin, ApiError, refreshCatalog } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { optimizable } from "@/lib/images";
import type { ProductsPage } from "@/lib/types";

type Row = ProductsPage["products"][number] & { stock?: number };

export default function AdminProducts() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [data, setData] = useState<{ products: Row[]; total: number } | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  // بعد الحفظ يعود النموذج إلى هنا بالرابط ?saved=رقم المنتج
  const saved = useSearchParams().get("saved");
  const [message, setMessage] = useState(saved ? `تم حفظ المنتج #${saved}.` : "");
  const [category, setCategory] = useState("");

  const load = useCallback(() => {
    admin.products(page, q).then(setData).catch(() => setMessage("تعذّر تحميل المنتجات."));
  }, [page, q]);
  useEffect(load, [load]);

  async function remove(id: number) {
    if (!token) return;
    try {
      await admin.deleteProduct(token, id);
      await refreshCatalog(token);
      setMessage(`حُذف المنتج رقم ${id}.`);
      setConfirmId(null);
      load();
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "تعذّر الحذف.");
    }
  }

  async function addCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !category.trim()) return;
    try {
      const created = await admin.createCategory(token, category.trim());
      await refreshCatalog(token);
      setMessage(`أُضيف التصنيف «${created.name}».`);
      setCategory("");
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "تعذّر إضافة التصنيف.");
    }
  }

  const pages = data ? Math.max(1, Math.ceil(data.total / 20)) : 1;
  const input = "rounded-xl border border-stone-300 px-4 py-2 focus:border-teal-700 focus:outline-none";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="ابحث عن منتج..."
          aria-label="ابحث عن منتج"
          className={`${input} min-w-0 flex-1`}
        />
        <Link href="/admin/products/new" className="rounded-full bg-amber-400 px-5 py-2 font-bold text-teal-950 hover:bg-amber-300">
          + منتج جديد
        </Link>
      </div>

      <form onSubmit={addCategory} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200">
        <label htmlFor="new-category" className="text-sm font-medium">
          تصنيف جديد
        </label>
        <input
          id="new-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="مثل: Home Decor"
          dir="ltr"
          className={`${input} min-w-0 flex-1`}
        />
        <button className="rounded-full px-5 py-2 ring-1 ring-stone-300 hover:bg-stone-100">إضافة</button>
      </form>

      {message && (
        <p role="status" className="rounded-xl bg-teal-50 px-4 py-2 text-teal-900">
          {message}
        </p>
      )}

      {!data ? (
        <p className="text-stone-500">جارٍ التحميل...</p>
      ) : data.products.length === 0 ? (
        <p className="text-stone-600">لا منتجات.</p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-2xl bg-white ring-1 ring-stone-200">
          {data.products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 px-4 py-3" data-testid="admin-product">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {p.thumbnail && (
                  <Image src={p.thumbnail} alt="" fill sizes="48px" unoptimized={!optimizable(p.thumbnail)} className="object-contain p-1" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  <bdi>{p.title}</bdi>
                </p>
                <p className="text-xs text-stone-500">
                  #{p.id} · <bdi>{p.category}</bdi>
                </p>
              </div>
              <bdi className="w-24 font-semibold text-teal-900">{formatPrice(p.price)}</bdi>
              <span className={`w-20 text-sm ${p.stock === 0 ? "font-bold text-rose-700" : (p.stock ?? 0) < 10 ? "text-amber-700" : "text-stone-600"}`}>
                المخزون {p.stock}
              </span>
              <Link href={`/admin/products/${p.id}`} className="text-sm text-teal-800 underline">
                تعديل
              </Link>
              {confirmId === p.id ? (
                <span className="flex items-center gap-2 text-sm">
                  <button onClick={() => remove(p.id)} className="rounded-full bg-rose-700 px-3 py-1 text-white">
                    تأكيد الحذف
                  </button>
                  <button onClick={() => setConfirmId(null)} className="text-stone-500 underline">
                    تراجع
                  </button>
                </span>
              ) : (
                <button onClick={() => setConfirmId(p.id)} className="text-sm text-rose-700 hover:underline">
                  حذف
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {data && pages > 1 && (
        <nav aria-label="صفحات المنتجات" className="flex items-center justify-center gap-4">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-full px-4 py-1.5 ring-1 ring-stone-300 disabled:opacity-40">
            السابقة
          </button>
          <span className="text-sm text-stone-600">
            صفحة {page} من {pages}
          </span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)} className="rounded-full px-4 py-1.5 ring-1 ring-stone-300 disabled:opacity-40">
            التالية
          </button>
        </nav>
      )}
    </div>
  );
}
