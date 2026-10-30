import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "السلة" };

export default function CartPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">سلة المشتريات</h1>
      <CartView />
    </>
  );
}
