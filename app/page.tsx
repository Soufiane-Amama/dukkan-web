import CategoryNav from "@/components/CategoryNav";
import Pagination from "@/components/Pagination";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/api";
import { countProducts } from "@/lib/format";

type Props = { searchParams: Promise<{ page?: string }> };

export default async function Home({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const data = await getProducts(page);
  return (
    <>
      <section className="mb-8 rounded-3xl bg-gradient-to-l from-teal-800 to-teal-950 px-6 py-10 text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">كل ما تحتاجه، في دُكّان واحد</h1>
        <p className="mt-3 text-teal-100">
          هواتف، وحواسيب، وعطور، ومستلزمات البيت. {countProducts(data.total)} بانتظارك.
        </p>
      </section>
      <CategoryNav />
      <h2 className="mb-4 mt-6 text-xl font-bold">أحدث المنتجات</h2>
      <ProductGrid products={data.products} />
      <Pagination basePath="/" page={page} total={data.total} />
    </>
  );
}
