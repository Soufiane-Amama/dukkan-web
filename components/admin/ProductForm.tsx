"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { admin, ApiError, refreshCatalog } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Category, ProductInput } from "@/lib/types";

const EMPTY: ProductInput = {
  title: "",
  description: "",
  category: "",
  price: 0,
  discountPercentage: 0,
  stock: 0,
  brand: "",
  thumbnail: "",
  images: [],
};

// نموذج واحد للإضافة (بلا id) وللتعديل (مع id)
export default function ProductForm({ id }: { id?: number }) {
  const { token } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<ProductInput | null>(id ? null : EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    admin.categories().then(setCategories).catch(() => setError("تعذّر تحميل التصنيفات."));
    if (id) {
      admin
        .product(id)
        .then((p) =>
          setValues({
            title: p.title,
            description: p.description ?? "",
            category: p.category,
            price: p.price,
            discountPercentage: p.discountPercentage,
            stock: p.stock,
            brand: p.brand ?? "",
            thumbnail: p.thumbnail ?? "",
            images: p.images ?? [],
          }),
        )
        .catch(() => setError("المنتج غير موجود."));
    }
  }, [id]);

  if (!values) return <p className="text-stone-500">{error || "جارٍ التحميل..."}</p>;

  const set = (field: keyof ProductInput, value: string | number | string[]) =>
    setValues({ ...values, [field]: value });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !values) return;
    setSending(true);
    setErrors({});
    setError("");
    try {
      const saved = id ? await admin.updateProduct(token, id, values) : await admin.createProduct(token, values);
      await refreshCatalog(token);
      router.push(`/admin/products?saved=${saved.id}`);
    } catch (e) {
      if (e instanceof ApiError && e.errors.length) {
        setErrors(Object.fromEntries(e.errors.map((x) => [x.field.split("[")[0], x.message])));
      } else {
        setError(e instanceof ApiError ? e.message : "تعذّر الحفظ. حاول مرة أخرى.");
      }
      setSending(false);
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-stone-300 px-4 py-2.5 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20";
  const field = (name: keyof ProductInput, label: string, control: React.ReactNode) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {control}
      {errors[name] && <span className="mt-1 block text-sm text-rose-700">{errors[name]}</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-3xl bg-white p-8 ring-1 ring-stone-200" noValidate>
      <h1 className="text-2xl font-bold">{id ? `تعديل المنتج #${id}` : "منتج جديد"}</h1>
      {field("title", "العنوان", <input name="title" value={values.title} onChange={(e) => set("title", e.target.value)} dir="auto" className={input} />)}
      {field("description", "الوصف", <textarea name="description" rows={3} value={values.description} onChange={(e) => set("description", e.target.value)} dir="auto" className={input} />)}
      <div className="grid gap-4 sm:grid-cols-2">
        {field(
          "category",
          "التصنيف",
          <select name="category" value={values.category} onChange={(e) => set("category", e.target.value)} className={input}>
            <option value="">اختر تصنيفاً</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>,
        )}
        {field("brand", "العلامة التجارية (اختياري)", <input name="brand" value={values.brand} onChange={(e) => set("brand", e.target.value)} dir="ltr" className={input} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {field("price", "السعر ($)", <input name="price" type="number" min={0} step="0.01" value={values.price} onChange={(e) => set("price", Number(e.target.value))} dir="ltr" className={input} />)}
        {field("discountPercentage", "الخصم (%)", <input name="discountPercentage" type="number" min={0} max={100} step="0.01" value={values.discountPercentage} onChange={(e) => set("discountPercentage", Number(e.target.value))} dir="ltr" className={input} />)}
        {field("stock", "المخزون", <input name="stock" type="number" min={0} step="1" value={values.stock} onChange={(e) => set("stock", Number(e.target.value))} dir="ltr" className={input} />)}
      </div>
      {field("thumbnail", "رابط الصورة المصغرة", <input name="thumbnail" type="url" value={values.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} dir="ltr" placeholder="https://..." className={input} />)}
      {field(
        "images",
        "روابط صور المعرض (رابط في كل سطر)",
        <textarea
          name="images"
          rows={3}
          value={values.images.join("\n")}
          onChange={(e) => set("images", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          dir="ltr"
          className={input}
        />,
      )}
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button disabled={sending} className="rounded-full bg-teal-800 px-8 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60">
          {sending ? "جارٍ الحفظ..." : id ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
        <Link href="/admin/products" className="text-stone-600 underline">
          إلغاء
        </Link>
      </div>
    </form>
  );
}
