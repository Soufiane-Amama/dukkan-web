import Image from "next/image";
import Link from "next/link";
import { optimizable } from "@/lib/images";
import type { ProductCard as Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";
import Price from "./Price";
import Rating from "./Rating";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md">
      <Link href={`/products/${product.id}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
          <Image
            src={product.thumbnail}
            alt={product.title}
            unoptimized={!optimizable(product.thumbnail)}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-3 transition group-hover:scale-105"
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-stone-500">
          <bdi className="truncate">{product.brand ?? product.category}</bdi>
          <Rating value={product.rating} />
        </div>
        <h3 className="mt-1 line-clamp-2 flex-1 font-semibold text-stone-800 group-hover:text-teal-800">
          <bdi>{product.title}</bdi>
        </h3>
        <div className="mt-2">
          <Price price={product.price} discountPercentage={product.discountPercentage} />
        </div>
      </Link>
      <div className="mt-3">
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
