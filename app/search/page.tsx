import type { Metadata } from "next";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import ProductGrid from "@/components/ProductGrid";
import { searchProducts } from "@/lib/api";
import { countProducts } from "@/lib/format";

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `نتائج «${q}»` : "البحث" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", page: pageParam } = await searchParams;
  const query = q.trim();
  if (!query) return <p className="text-stone-600">اكتب ما تبحث عنه في الحقل أعلى الصفحة.</p>;

  const page = Math.max(1, Number(pageParam) || 1);
  const data = await searchProducts(query, page);
  return (
    <>
      <div className="mb-6 flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold">
          نتائج البحث عن «<bdi>{query}</bdi>»
        </h1>
        <span className="text-stone-500">{countProducts(data.total)}</span>
      </div>
      {data.total === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
          <p className="text-lg">لم نجد منتجاً بهذا الاسم.</p>
          <p className="mt-2 text-stone-500">جرّب كلمة إنجليزية أقصر، مثل phone أو watch.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-teal-800 px-6 py-2 text-white hover:bg-teal-700"
          >
            تصفّح كل المنتجات
          </Link>
        </div>
      ) : (
        <>
          <ProductGrid products={data.products} />
          <Pagination
            basePath={`/search?q=${encodeURIComponent(query)}`}
            page={page}
            total={data.total}
          />
        </>
      )}
    </>
  );
}
