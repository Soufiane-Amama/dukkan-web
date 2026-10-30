"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { ProductCard } from "@/lib/types";

export default function AddToCartButton({
  product,
  large = false,
}: {
  product: ProductCard;
  large?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full rounded-full font-semibold transition ${large ? "py-3 text-lg" : "py-2 text-sm"} ${
        added ? "bg-emerald-600 text-white" : "bg-teal-800 text-white hover:bg-teal-700"
      }`}
    >
      {added ? "✓ أُضيف إلى السلة" : "أضف إلى السلة"}
    </button>
  );
}
