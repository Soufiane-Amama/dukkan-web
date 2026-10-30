import type { Metadata } from "next";
import CategoryNav from "@/components/CategoryNav";
import Pagination from "@/components/Pagination";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getCategoryProducts } from "@/lib/api";
import { countProducts } from "@/lib/format";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

async function findCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await findCategory((await params).slug);
  return { title: category?.name ?? "تصنيف غير موجود" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const category = await findCategory(slug);
  if (!category) notFound();
  const data = await getCategoryProducts(slug, page);
  return (
    <>
      <CategoryNav active={slug} />
      <div className="mb-4 mt-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <span className="text-stone-500">{countProducts(data.total)}</span>
      </div>
      <ProductGrid products={data.products} />
      <Pagination basePath={`/category/${slug}`} page={page} total={data.total} />
    </>
  );
}
