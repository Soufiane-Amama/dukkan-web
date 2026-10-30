import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import Price from "@/components/Price";
import Rating from "@/components/Rating";
import { getProduct } from "@/lib/api";
import { optimizable } from "@/lib/images";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).id);
  return product
    ? { title: product.title, description: product.description }
    : { title: "منتج غير موجود" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <article className="grid gap-10 md:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200">
          <Image
            src={product.images[0] ?? product.thumbnail}
            alt={product.title}
            unoptimized={!optimizable(product.images[0] ?? product.thumbnail)}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-6"
          />
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images.slice(1, 5).map((src) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-xl bg-white ring-1 ring-stone-200"
              >
                <Image src={src} alt="" fill unoptimized={!optimizable(src)} sizes="12vw" className="object-contain p-2" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Link
          href={`/category/${product.category}`}
          className="text-sm text-teal-700 hover:underline"
        >
          {product.category}
        </Link>
        <h1 className="mt-2 text-3xl font-bold">
          <bdi>{product.title}</bdi>
        </h1>
        <div className="mt-3 flex items-center gap-4 text-sm text-stone-500">
          {product.brand && <bdi>{product.brand}</bdi>}
          <Rating value={product.rating} />
          <span>{product.reviews.length} مراجعات</span>
        </div>
        <div className="mt-6">
          <Price price={product.price} discountPercentage={product.discountPercentage} large />
        </div>
        <p className={`mt-2 text-sm ${product.stock > 0 ? "text-emerald-700" : "text-rose-700"}`}>
          {product.stock > 0 ? `الكمية المتوفرة: ${product.stock}` : "نفد من المخزون"}
        </p>
        <div className="mt-6 max-w-sm">
          <AddToCartButton product={product} large />
        </div>
        <ul className="mt-6 space-y-1 text-sm text-stone-600">
          <li>
            🛡️ <bdi>{product.warrantyInformation}</bdi>
          </li>
          <li>
            🚚 <bdi>{product.shippingInformation}</bdi>
          </li>
        </ul>
        <h2 className="mt-8 text-lg font-bold">الوصف</h2>
        <p dir="auto" className="mt-2 leading-relaxed text-stone-700">
          {product.description}
        </p>
      </div>

      <section className="md:col-span-2">
        <h2 className="text-lg font-bold">آراء المشترين</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {product.reviews.map((r, i) => (
            <li key={i} className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
              <div className="flex items-center justify-between">
                <bdi className="font-semibold">{r.reviewerName}</bdi>
                <Rating value={r.rating} />
              </div>
              <p dir="auto" className="mt-2 text-stone-600">
                {r.comment}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
