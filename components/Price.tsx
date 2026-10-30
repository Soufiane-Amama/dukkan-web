import { finalPrice, formatPrice } from "@/lib/format";

export default function Price({
  price,
  discountPercentage,
  large = false,
}: {
  price: number;
  discountPercentage: number;
  large?: boolean;
}) {
  const hasDiscount = discountPercentage >= 1;
  return (
    <p className="flex flex-wrap items-baseline gap-2">
      <bdi className={`font-bold text-teal-900 ${large ? "text-3xl" : "text-lg"}`}>
        {formatPrice(finalPrice(price, discountPercentage))}
      </bdi>
      {hasDiscount && (
        <>
          <bdi className="text-sm text-stone-400 line-through">{formatPrice(price)}</bdi>
          <bdi className="rounded bg-rose-100 px-1.5 text-xs font-semibold text-rose-700">
            -{Math.round(discountPercentage)}%
          </bdi>
        </>
      )}
    </p>
  );
}
